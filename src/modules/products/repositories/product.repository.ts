import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import * as admin from 'firebase-admin';
import { ProductDb } from '../../../db/product.db';
import { CreateProductDTO } from '../commands/create-product/dtos/create-product.dto';
import { UpdateProductDTO } from '../commands/update-product/dtos/update-product.dto';
import { Product } from '../entities/product';

@Injectable()
export class ProductRepository {

  constructor(
  ) {}

  async findByCompany(param: FindByCompany) {
    let query = admin.firestore()
      .collection('products')
      .where('companyId', '==', param.companyId)

    if (param.internalId) {
      query = query
        .where("productInternalId", '==', param.internalId);
    }

    query = query
      .orderBy('name', 'asc')
      .offset(param.page * 30)
      .limit(30);
    
    return query
      .get()
      .then(snapshot =>
        snapshot.docs.map(d => <Product> {
          ...d.data(),
          id: d.id
        })
      );
  }

  async delete(productId: string) {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .delete();
  }

  async findById(productId: string) {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .get()
      .then(snapshot => (<Product> {
        ...snapshot.data(),
        id: snapshot.id
      }));
  }

  async findByCompanyIdAndId(companyId: string, productId: string): Promise<Product> {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          const product = snapshot.data() as ProductDb;
          if (product.companyId !== companyId) {
            return undefined;
          }
          
          return {
            ...product,
            id: snapshot.id,
            isVisible: product.isVisible === false ? false : true
          } as Product;
        }
        return undefined;
      });
  }

  async save(product: CreateProductDTO & {companyId: string, createdBy: string}): Promise<{id: string}> {
    return admin.firestore()
      .collection('products')
      .add({...product, createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T")})
      .then(snapshot => {
        return {id: snapshot.id}
      })
  }

  async update(product: UpdateProductDTO & {companyId: string, updatedBy: string}): Promise<void> {
    const update = {
      ...product,
      updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T")
    }

    return admin.firestore()
      .collection('products')
      .doc(product.id)
      .update(update)
      .then(() => Promise.resolve())
  }

  async setVisibility(params: SetVisibility): Promise<void> {
    const update = {
      isVisible: params.isVisible,
      updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T")
    }

    return admin.firestore()
      .collection('products')
      .doc(params.productId)
      .update(update)
      .then(() => Promise.resolve())
  }

}

type FindByCompany = {
  companyId: string,
  internalId: string,
  page: number
}

type SetVisibility = {
  productId: string;
  isVisible: boolean;
}