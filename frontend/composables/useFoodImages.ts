export type FoodImage = {
  id: number;
  src: string;
  alt: string;
  name: string;
};

export const foodImages: FoodImage[] = [
  { id: 1, src: '/images/foods/baghali-polo-01.png', alt: 'باقالی پلو با ماهیچه', name: 'باقالی پلو' },
  { id: 2, src: '/images/foods/joojeh-kabab.png', alt: 'جوجه کباب', name: 'جوجه کباب' },
  { id: 3, src: '/images/foods/makaroni.png', alt: 'ماکارونی', name: 'ماکارونی' },
  { id: 4, src: '/images/foods/kabab-koobideh.png', alt: 'چلو کباب کوبیده', name: 'کباب کوبیده' },
  { id: 5, src: '/images/foods/gheymeh.png', alt: 'خورش قیمه', name: 'قیمه' },
  { id: 6, src: '/images/foods/adas-polo.png', alt: 'عدس پلو', name: 'عدس پلو' },
  { id: 7, src: '/images/foods/abgoosht.png', alt: 'آبگوشت', name: 'آبگوشت' },
  { id: 8, src: '/images/foods/baghali-polo-02.png', alt: 'باقالی پلو', name: 'باقالی پلو' },
  { id: 9, src: '/images/foods/pizza.png', alt: 'پیتزا', name: 'پیتزا' },
  { id: 10, src: '/images/foods/tahchin.png', alt: 'تهچین', name: 'تهچین' },
  { id: 11, src: '/images/foods/khoresh-karafs.png', alt: 'خورش کرفس', name: 'خورش کرفس' },
  { id: 12, src: '/images/foods/kuku-sabzi.png', alt: 'کوکو سبزی', name: 'کوکو سبزی' },
  { id: 13, src: '/images/foods/zereshk-polo.png', alt: 'زرشک پلو با مرغ', name: 'زرشک پلو' },
  { id: 14, src: '/images/foods/albaloo-polo.png', alt: 'آلبالو پلو', name: 'آلبالو پلو' },
  { id: 15, src: '/images/foods/lubia-polo.png', alt: 'لوبیا پلو', name: 'لوبیا پلو' },
  { id: 16, src: '/images/foods/ghormeh-sabzi.png', alt: 'قرمه سبزی', name: 'قرمه سبزی' },
  { id: 17, src: '/images/foods/ash-reshteh.png', alt: 'آش رشته', name: 'آش رشته' },
  { id: 18, src: '/images/foods/sabzi-polo-ba-mahi.png', alt: 'سبزی پلو با ماهی', name: 'سبزی پلو با ماهی' },
  { id: 19, src: '/images/foods/fesenjan.png', alt: 'خورش فسنجان', name: 'فسنجان' },
];

/** Hero collage — square thumbnails (20 items ≈ 4 rows); cycles through food images. */
export const foodThumbs: FoodImage[] = Array.from({ length: 20 }, (_, i) => {
  const image = foodImages[i % foodImages.length];
  return {
    ...image,
    id: i + 1,
    alt: `${image.alt} — نمونه ${i + 1}`,
  };
});
