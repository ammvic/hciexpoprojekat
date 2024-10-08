import icons from './icons';
import images from './images';
import {FeaturesTypes, ProductTypes, SplashTypes, TabBarTypes} from './types';
// random number between 1 to 1000 :)
const randomNumber = () => Math.floor(Math.random() * 1000) + 1;
// set the random number to the URL
const randomImage = (): string =>
  `https://picsum.photos/${Math.floor(Math.random() * 1000) + 1}/${
    Math.floor(Math.random() * 1000) + 1
  }`;

  const images1 = [
    "https://media.dm-static.com/image/upload/q_auto:eco,f_auto/content/rootpage-dm-shop-sr-rs/resource/image/1370476/widescreen/1200/500/3feb0ae7009a9db382ba390ca807411d/3180CA30F587FE952B3B1FCFD2E104EE/babybonus-kep2.jpg",
    "https://media.dm-static.com/image/upload/q_auto:eco,f_auto/content/rootpage-dm-shop-sr-rs/resource/image/2320238/widescreen/1200/500/65a3086c09f1d5c8cc312e3d2757cb7e/696573C5526864E3A767A938AE6BF14E/logoa.jpg",
    "https://www.activebeauty.rs/imgs/970/250/90/data/0ea1379a-18f2-4fbb-a0bd-0e2921d1b266-jpg.webp",
  ];
  
const SplashData: SplashTypes[] = [
  {
    image: images.splash1,
    title: 'Izaberite proizvod',
    description:
      'Lako pretraži i filtriraj širok asortiman proizvoda prema svojim potrebama. Iskoristi detaljne opise i ocene da pronađeš savršeni proizvod za tebe.',
  },
  {
    image: images.splash2,
    title: 'Odaberite plaćanje',
    description:
      'Jednostavno izaberi najpogodniji način plačanja za tvoju kupovinu. Pružamo različite opcije kako bi transakcija bila brza i sigurna.',
  },
  {
    image: images.splash3,
    title: 'Preuzmite proizvod',
    description:
      'Brzo i jednostavno potvrdi svoju kupovinu i organizuj preuzimanje proizvoda. Pružamo sve informacije potrebne za preuzimanje i omogućava ti da završiš transakciju bez stresa.',
  },
];
const CategoriesData: FeaturesTypes[] = [
  {
    image: "https://media.dm-static.com/image/upload/q_auto:eco,f_auto/content/rootpage-dm-shop-sr-rs/resource/image/1488502/landscape/400/281/82d640688da917e2855ce35a3fb4bc34/B4605851F982DF176F0855010AE7B773/dm-sortiment-pflege-und-parfum-teaserbild.png",
    title: 'Nega i parfemi',
  },
  {
    image: "https://media.dm-static.com/image/upload/q_auto:eco,f_auto/content/rootpage-dm-shop-sr-rs/resource/image/1488514/landscape/400/281/87ed713f3c101bb17cc2ed84ce3920c7/A07CEBC82F3129A3ED50041E8AEE7C62/dm-sortiment-make-up-teaserbild.png",
    title: 'Šminka',
  },
  {
    image:  "https://media.dm-static.com/image/upload/q_auto:eco,f_auto/content/rootpage-dm-shop-sr-rs/resource/image/1488496/landscape/400/281/ed178ba192fc61761777daa85ba0a903/1298CB5E44A2D4F8082754E5EAC94763/dm-sortiment-baby-und-kind-teaserbild.png",
    title: 'Bebe i deca',
  },
  {
    image: "https://media.dm-static.com/image/upload/q_auto:eco,f_auto/content/rootpage-dm-shop-sr-rs/resource/image/1488522/landscape/400/281/b8101c5018b0e23d854827349784eb7f/17D2A2CBAE8117D1AFA0BADD24E786AD/dm-sortiment-maennerpflege-teaserbild.png",
    title: 'Muškarci',
  },
  {
    image: "https://media.dm-static.com/image/upload/q_auto:eco,f_auto/content/rootpage-dm-shop-sr-rs/resource/image/1488492/landscape/400/281/830186b13bd75237813923942685079/4680D7FC4F8187F18650B6F3E2F2458E/dm-sortiment-gesundheit-teaserbild.png",
    title: 'Zdravlje',
  },
];

// Random Title
const titles = [
  'Women Printed Kurta',
  'HRX by Hrithik Roshan',
  "IWC Schaffhausen 2021 Pilot's Watch",
  'Labbin White Sneakers',
  'Black Winter Jacket',
  'Mens Starry Printed Shirt',
  'Black Dress',
  'Pink Embroidered Dress',
  'Realme 7',
  'Black Jacket',
  'D7200 Digital Camera',
  "Men's & Boys Formal Shoes",
];

const randomTitle = (): string =>
  titles[Math.floor(Math.random() * titles.length)];

const randomPrice = (): number =>
  parseFloat((Math.floor(Math.random() * 5000) + 500).toFixed(2));

const randomPriceBeforeDeal = (): number =>
  parseFloat(
    (randomPrice() + (Math.floor(Math.random() * 1000) + 100)).toFixed(2),
  );

const randomPriceOff = (price: number, priceBeforeDeal: number): string =>
  ((1 - price / priceBeforeDeal) * 100).toFixed(2);

const randomStars = (): number => (Math.random()  * 5);

const randomNumberOfReview = (): number => Math.floor(Math.random() * 10000);

const ProductData: ProductTypes[] = Array.from(
  {length: 15},
  (): ProductTypes => {
    const price = randomPrice();
    const priceBeforeDeal = randomPriceBeforeDeal();
    return {
      image: randomImage(),
      title: randomTitle(),
      description: 'Ekskluzivni proizvod u ponudi.',
      price: price,
      priceBeforeDeal: priceBeforeDeal,
      priceOff: randomPriceOff,
      stars: randomStars(),
      numberOfReview: randomNumberOfReview(),
      _id: randomNumber().toString(), // Generišemo nasumični ID
    };
  },
);
/**

 */
// TabBar data
const tabName = ['Home', 'Wishlist', 'Cart', 'Search', 'Setting'];
const TabBarData: TabBarTypes[] = [
  {
    title: tabName[0],
    image: icons.home,
    link: tabName[0],
    inActiveColor: '#000000',
    activeColor: '#EB3030',
  },
  {
    title: tabName[1],
    image: icons.home,
    link: tabName[1],
    inActiveColor: '#000000',
    activeColor: '#EB3030',
  },
  {
    title: tabName[2],
    image: icons.home,
    link: tabName[2],
    inActiveColor: '#050404',
    activeColor: '#EB3030',
    inActiveBGColor: '#FFFFFF',
    activeBGColor: '#EB3030',
  },
  {
    title: tabName[3],
    image: icons.home,
    link: tabName[3],
    inActiveColor: '#000000',
    activeColor: '#EB3030',
  },
  {
    title: tabName[4],
    image: icons.home,
    link: tabName[4],
    inActiveColor: '#000000',
    activeColor: '#EB3030',
  },
];

export { 
  TabBarData,
  ProductData,
  CategoriesData,
  SplashData,
  images1
}