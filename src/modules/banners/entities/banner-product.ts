export type BannerProduct = {
    id: string;
    images: ProductImage[];
    name: string;
    price: number;
    priceWithDiscount: number;
}

export type ProductImage = {
    fileName: string;
    imageUrl: string
}