import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class ProductStockRepository {

  constructor(
  ) {}

  async updateStockAmount(update: UpdateProductStock) {
    return this.findProductByInternalId(update).then(snapshot => {
      if (!snapshot.empty) {
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          this.updateProduct(doc.id, update, data.weight);
          this.updateStock(doc.id, update);
        })
      }
    })
  }

  private updateProduct(productId: string, update: UpdateProductStock, productWeight: number) {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .update(this.createUpdateModel(update, productWeight));
  }

  private updateStock(productId: string, update: UpdateProductStock) {
    return this.findStockByProductId({productId, companyId: update.companyId})
      .then(snapshot => {
        if (!snapshot.empty) {
          snapshot.docs.forEach(doc => {
            return admin.firestore()
              .collection('stocks')
              .doc(doc.id)
              .update({quantity: update.totalStock});
          })
        }
      })
  }

  private createUpdateModel(update: UpdateProductStock, productWeight: number) {
    const response: any = {
      totalStock: update.totalStock
    };

    if (update.isPromotion) {
      response.priceWithDiscount = update.price * (productWeight || 1);
    } else {
      response.price = update.price * (productWeight || 1);
      response.priceWithDiscount = null;
    }
    return response;
  }

  private findProductByInternalId({productInternalId, companyId}) {
    return admin.firestore()
      .collection('products')
      .where('companyId', '==', companyId)
      .where('productInternalId', '==', productInternalId)
      .get()
  }

  private findStockByProductId({productId, companyId}) {
    return admin.firestore()
      .collection('stocks')
      .where('companyId', '==', companyId)
      .where("productId", '==', productId)
      .get()
  }

}

type UpdateProductStock = {
  companyId: string;
  isPromotion: boolean;
  price: number;
  productInternalId: string;
  totalStock: number;
}