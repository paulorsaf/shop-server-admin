import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Stock, StockOption } from '../entities/stock';

@Injectable()
export class StockRepository {

  constructor(
  ) {}

  async addStockOption(stockId: string, stockOption: StockOption) {
    return admin.firestore()
      .collection('stocks')
      .doc(stockId)
      .update({
        stockOptions: admin.firestore.FieldValue.arrayUnion(
          JSON.parse(JSON.stringify(stockOption))
        )
      });
  }

  async createStock(stock: Stock) {
    return admin.firestore()
      .collection('stocks')
      .doc(stock.id)
      .create(JSON.parse(JSON.stringify(stock)));
  }

  async findByProduct(productId: string) {
    return admin.firestore()
      .collection('stocks')
      .where('productId', '==', productId)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return null;
        }
        return <Stock> snapshot.docs[0].data();
      });
  }

}
