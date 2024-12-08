import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Interpolation } from "styled-components";
import { Substitute } from "styled-components/dist/types";

export interface Link {
  name: string;
  url: string;
}

export interface ColorSchema {
  primary: string;
  secondary: string;
  text: string;
}
export interface CollapseBlockSetting extends CommonSettings {
  titleFontSize: string;
  titleFontWeight: string;
  imageAlign: string;
  imageRadius: string;
  backgroundColorMultiRow: string;
  allTextPosition: Interpolation<
    Substitute<
      DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
      { $data: RichTextBlock }
    >
  >;
  textColor1?: string;
  textColor2?: string;
  textColor3?: string;
  textColor4?: string;
  contentColor1?: string;
  contentColor2?: string;
  contentColor3?: string;
  contentColor4?: string;
  contentFontSize?: string;
  contentFontWeight?: string;
  contentColor?: string;
}

export interface CollapseBlock {
  heading?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  content1?: string;
  content2?: string;
  content3?: string;
  content4?: string;
  setting: CollapseBlockSetting;
  links: Link[];
}

export interface CollapseSection {
  blocks: CollapseBlock[];
  setting: CollapseBlockSetting;
  type: "collapse";
}

export interface CommonSettings {
  backgroundColor?: string;
  headingFontSize: string;
  formBackground: string;
  textColor?: string;
  btnTextColor?: string;
  imageWidth?: string;
  imageHeight?: string;
  opacityImage?: string;
  heading?: string;
  titleColor?: string;
  descriptionColor?: string;
  backgroundColorBox?: string;
  btnColor?: string;
  btnBackgroundColor?: string;
  imageBehavior?: string;
  imageRadious?: string;
  headingColor?: string;
  background?: string;
  headingFontWeight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  textFontSize?: string;
  textFontWeight?: string;
  descriptionFontSize?: string;
  descriptionFontWeight?: string;
  btnTextFontSize?: string;
  btnTextFontWeight?: string;
  opacityTextBox?: string;
  backgroundBoxRadious?: string;
  imageSrc?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  content1?: string;
  content2?: string;
  content3?: string;
  content4?: string;
  setting: CollapseBlockSetting;
  paddingRight?: string;
  paddingLeft?: string;
  marginRight?: string;
  marginLeft?: string;

}

export interface HeaderBlockSettings extends CommonSettings {
  imageWidth: string;
  imageHeight: string;
  imageRadius: string;
  itemColor: string;
  itemFontSize: string;
  itemFontWeight: string;
  itemHoverColor: string;
  backgroundColorNavbar: string;
  titleColor: string;
}
export interface HeaderBlock {
  imageLogo: string;
  imageAlt: string;
  links: Link[];
  setting: HeaderBlockSettings;
}

export interface HeaderSection {
  type: "header";
  blocks: HeaderBlock;
  setting: CommonSettings & {
    navbarPosition: string;
    paddingTop: string;
    paddingBottom: string;
    marginBottom: string;
  };
}
export interface BannerBlockSettings extends CommonSettings {
  descriptionColor: string;
  descriptionFontSize: string;
  descriptionFontWeight: string;
  textColor: string;
  textFontSize: string;
  textFontWeight: string;
  backgroundColorBox: string;
  backgroundBoxRadious: string;
  opacityImage: string;
  opacityTextBox: string;
  imageRadious: string;
  imageBehavior: string;
  
}
export interface BannerBlock {
  imageSrc: string;
  imageAlt: string;
  text: string;
  description: string;
  imageLink?: string;
  setting: CommonSettings;
}
export interface BannerSection {
  type: "banner";
  blocks: BannerBlock;
  setting: CommonSettings;
}

export interface BlockSetting {
  [key: number]: string | number | boolean | CommonSettings;
}
// Add these new interfaces for MultiColumn component
export interface MultiColumnBlockSetting extends CommonSettings {
  headingColor?: string;
  titleColor?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  descriptionColor?: string;
  backgroundColorBox?: string;
  btnColor?: string;
  btnBackgroundColor?: string;
  imageRadious?: string;
}

export interface MultiColumnBlock {
  title1?: string;
  title2?: string;
  title3?: string;
  description1?: string;
  description2?: string;
  description3?: string;
  imageSrc1?: string;
  imageSrc2?: string;
  imageSrc3?: string;
  btnLable1?: string;
  btnLable2?: string;
  btnLable3?: string;
  btnLink1?: string;
  btnLink2?: string;
  btnLink3?: string;
}
export interface MultiColumnSection {
  blocks: {
    [key: number]: MultiColumnBlock;
  };
  setting: MultiColumnBlockSetting;
  type: "multicolumn";
}

// Add these new interfaces for Newsletter component
export interface NewsLetterBlockSetting extends CommonSettings {
  textHeadingColor: Interpolation<
    Substitute<
      DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
      { $data: RichTextBlockSetting }
    >
  >;
  headingColor: string;
  headingFontSize: string;
  headingFontWeight: string;
  descriptionColor: string;
  descriptionFontSize: string;
  descriptionFontWeight: string;
  btnTextColor: string;
  btnBackgroundColor: string;
  formBackground: string;
}

export interface NewsLetterBlock {
  heading: string;
  description: string;
  btnText: string;
  setting: NewsLetterBlockSetting;
}

export interface NewsLetterSection {
  blocks: NewsLetterBlock;
  setting: CommonSettings;
  type: "newsletter";
}
// Add these new interfaces for RichText component

export interface RichTextBlockSetting extends CommonSettings {
  textHeadingColor: string;
  textHeadingFontSize: string;
  textHeadingFontWeight: string;
  descriptionColor: string;
  descriptionFontSize: string;
  descriptionFontWeight: string;
  btnTextColor: string;
  btnBackgroundColor: string;
  background: string;
}

export interface RichTextBlock {
  textHeading: string;
  description: string;
  btnText: string;
  btnLink: string;
  setting: {
    textHeadingColor?: string;
    textHeadingFontSize?: string;
    textHeadingFontWeight?: string;
    descriptionColor?: string;
    descriptionFontSize?: string;
    descriptionFontWeight?: string;
    btnTextColor?: string;
    btnBackgroundColor?: string;
    paddingTop?: string;
    paddingBottom?: string;
    marginTop?: string;
    marginBottom?: string;
    background?: string;
  };
}

export interface RichTextSection {
  blocks: RichTextBlock;
  setting: CommonSettings;
  type: "rich-text";
}

export interface Section {
  setting: CommonSettings;
  blocks:
    | HeaderBlock
    | CollapseBlock
    | ImageTextBlock
    | MultiColumnBlock
    | NewsLetterBlock
    | RichTextBlock;
  type: string;
}
export interface ImageTextBlockSetting extends CommonSettings {
  headingColor: string;
  headingFontSize: string;
  headingFontWeight: string;
  descriptionColor: string;
  descriptionFontSize: string;
  descriptionFontWeight: string;
  btnTextColor: string;
  btnBackgroundColor: string;
  backgroundColorBox: string;
  backgroundBoxOpacity: string;
  boxRadiuos: string;
  opacityImage: string;
  imageWidth: string;
  imageHeight: string;
  background: string;
}

// Add this new interface for ImageText blocks
export interface ImageTextBlock {
  imageSrc: string;
  imageAlt: string;
  heading: string;
  description: string;
  btnLink: string;
  btnText: string;
  setting: ImageTextBlockSetting;
}

// Add this new interface for ImageText section
export interface ImageTextSection {
  blocks: ImageTextBlock;
  setting: CommonSettings;
  type: "image-text";
}

export interface FooterSection {
  type: "Footer";
  blocks: {
    text: string;
    description: string;
    instagramLink: string;
    telegramLink: string;
    whatsappLink: string;
    logo: string;
    links?: { url: string; label: string }[];
    setting: FooterBlockSetting;
  };
  setting: CommonSettings;
}
export interface FooterBlockSetting {
  textColor: string;
  textFontSize: string;
  textFontWeight: string;
  descriptionColor: string;
  descriptionFontSize: string;
  descriptionFontWeight: string;
  linkColor: string;
  logoWidth: string;
  logoHeight: string;
  logoRadius: string;
  backgroundColor: string;
}

export interface FooterLink {
  url: string;
  label: string;
}

export interface FooterBlock {
  setting: FooterBlockSetting;
  text: string;
  description: string;
  instagramLink: string;
  telegramLink: string;
  whatsappLink: string;
  logo: string;
  links: FooterLink[];
}

export interface ContactFormBlockSetting extends Partial<CommonSettings> {
  headingColor?: string;
  headingFontSize?: string;
  headingFontWeight?: string;
  btnTextColor?: string;
  btnBackgroundColor?: string;
  formBackground?: string;
}

export interface ContactFormBlock {
  setting: ContactFormBlockSetting;
  heading?: string;
}

export interface ContactFormSection {
  blocks: ContactFormBlock;
  setting: {
    paddingTop?: string;
    paddingBottom?: string;
    marginTop?: string;
    marginBottom?: string;
  };
  type: "contact-form";
}

export interface ContactFormProps {
  setting: CommonSettings;
  blocks: BlockSetting;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: {
    sections?: {
      children?: { sections: ContactFormSection[] };
    };
  };
}

// Add this new interface for ImageText section
export interface ImageTextSection {
  blocks: ImageTextBlock;
  setting: CommonSettings;
  type: "image-text";
}

export interface Children {
  type: string;
  sections: Section[];
  order: string[];
}

export interface Layout {
  setting: {
    backgroundColor: string;
    fontFamily: string;
    colorSchema: ColorSchema;
  };
  blocks: string;
  type: "layout";
  settings: {
    fontFamily: string;
    colorSchema: ColorSchema;
  };
  sections: {
    find(arg0: (section: any) => boolean): unknown;
    slideshow: SlideSection;
    richtext: RichTextSection;
    sectionHeader: HeaderSection;
    children:
      | Children
      | AboutChildren
      | StoreChildren
      | DetailPageChildren
      | BlogChildren
      | BlogDetailChildren;
    sectionFooter: FooterSection;
    Collection: CollectionSection;
    banner: BannerSection;
  };
  order: string[];
}
export interface SlideBlockSetting {
  textColor?: string;
  textFontSize?: string;
  textFontWeight?: string;
  descriptionColor?: string;
  descriptionFontSize?: string;
  descriptionFontWeight?: string;
  btnTextColor?: string;
  btnBackgroundColor?: string;
  backgroundBoxRadius?: string;
  opacityImage?: string;
  imageRadious?: string;
  imageBehavior?: string;
}
export interface SlideBlock {
  imageSrc: string;
  imageAlt: string;
  text: string;
  description: string;
  btnText: string;
  btnLink: string;
  setting?: SlideBlockSetting;
}

export interface SlideSection {
  textFontWeight: string;
  textFontSize: string;
  textColor: string;
  opacityImage: string;
  imageRadious: string;
  imageBehavior: string;
  btnBackgroundColor: string;
  btnTextColor: string;
  blocks: SlideBlock[];
  setting: CommonSettings & {
    paddingTop: string;
    paddingBottom: string;
    marginTop: string;
    marginBottom: string;
    backgroundBoxRadius: string;
  };
  type: "slideshow";
}
// Add these new interfaces for Video component
export interface VideoBlockSetting extends Partial<CommonSettings> {
  headingColor?: string;
  backgroundVideoSection?: string;
  headingFontSize?: string;
  headingFontWeight?: string;
  videoWidth?: string;
  videoRadious?: string;
  videoPoster?: string;
  videoLoop?: boolean;
  videoMute?: boolean;
  videoAutoplay?: boolean;
}

export interface VideoBlock {
  heading?: string;
  videoUrl: string;
  videoAlt?: string;
  setting: VideoBlockSetting;
}

export interface VideoSection {
  blocks: VideoBlock;
  setting: CommonSettings;
  type: "video";
}

export interface VideoFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<VideoSection>>;
  userInputData: VideoSection;
  layout: Layout;
  selectedComponent: string;
}
// Add these new interfaces for Contact Form
export interface ContactFormBlockSetting extends Partial<CommonSettings> {
  headingColor?: string;
  headingFontSize?: string;
  headingFontWeight?: string;
  btnTextColor?: string;
  btnBackgroundColor?: string;
  formBackground?: string;
}

export interface ContactFormBlock {
  heading?: string;
  setting: ContactFormBlockSetting;
}

export interface ContactFormDataSection {
  blocks: ContactFormBlock;
  setting: {
    paddingTop: string;
    paddingBottom: string;
    marginTop: string;
    marginBottom: string;
    marginLeft?: string;
    marginRight?: string;
    paddingLeft?: string;
    paddingRight?: string;
  };
  type: "contact-form";
}

// export interface ContactFormProps {
//   setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
//   layout: {
//     sections?: {
//       children?: {
//         sections: ContactFormSection[];
//       };
//     };
//   };
// }
export interface MultiRowBlockSetting extends CommonSettings {
  titleColor: string;
  titleFontWeight: string;
  titleFontSize?: string;
  backgroundColorMultiRow: string;
  backgroundColorBox: string;
  imageRadius: string;
  imageWidth: string;
  imageHeight: string;
  headingColor: string;
  headingFontSize: string;
  headingFontWeight: string;
  descriptionColor: string;
  descriptionFontSize: string;
  descriptionFontWeight: string;
  btnColor: string;
  btnBackgroundColor: string;
  imageAlign: string;
}

export interface MultiRowBlock {
  heading: string;
  description: string;
  btnLable: string;
  btnLink: string;
  imageSrc: string;
  imageAlt: string;
}

export interface MultiRowSection {
  type: "multiRow";
  title: string;
  blocks: MultiRowBlock[];
  setting: MultiRowBlockSetting;
}

export interface MultiRowFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<MultiRowSection>>;
  userInputData: MultiRowSection;
  layout: Layout;
}
export interface FooterFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<FooterSection>>;
  userInputData: FooterSection;
  layout: Layout;
  selectedComponent: string;
}

export interface AboutChildren {
  type: string;
  sections: Section[];
  order: string[];
}

export interface SectionsState {
  slideshow?: SlideSection;
  richtext?: RichTextSection;
  sectionHeader?: HeaderSection;
  children?:
    | Children
    | AboutChildren
    | DetailPageChildren
    | BlogChildren
    | BlogDetailChildren
    | StoreChildren;
  sectionFooter?: FooterSection;
  banner?: BannerSection;
  footer?: string;
}

//  these new interfaces for Product List

export interface ProductBlockSetting extends CommonSettings {
  headingColor: string;
  headingFontSize: string;
  headingFontWeight: string;
  descriptionColor: string;
  descriptionFontSize: string;
  imageRadius: string;
  productNameColor: string;
  priceColor: string;
  btnBackgroundColor: string;
  btnTextColor: string;
  gridColumns: number;
}

export interface ProductListSection {
  productId: number;
  imageSrc: string;
  imageAlt: string;
  name: string;
  description: string;
  price: string;
  btnText: string;
  btnLink: string;
}

export interface ProductSection {
  type: "store";
  blocks: ProductListSection[];
  setting: ProductBlockSetting;
}

export interface ProductStoreLayout {
  type: "store";
  children: {
    sections: ProductListSection[];
    order: string[];
  };
}
export interface StoreChildren {
  type: "store";
  sections: ProductSection[];
  order: string[];
}

export interface productCard {
  blocks: any;
  setting: any;
  cardBorderRadius?: string;
  cardBackground?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageRadius?: string;
  nameFontSize?: string;
  nameFontWeight?: string;
  nameColor?: string;
  descriptionFontSize?: string;
  descriptionFontWeight?: string;
  descriptionColor?: string;
  priceFontSize?: string;
  priceColor?: string;
  btnBackgroundColor?: string;
  btnColor?: string;
}
// export interface ProductCardData {
//   imageSrc: string[];
//   imageAlt: string[];
//   name: string;
//   description: string;
//   price: string;
//   category: string;
//   status: string;
//   discount: string;
//   id: string;
//   innventory: string;
// }

export interface ProductImage {
  imageSrc: string;
  imageAlt: string;
}
export interface ProductCardData {
  images: ProductImage[];
  name: string;
  description: string;
  price: string;
  id: string;
  category?: string;
  discount?: string;
  status?: string;
  inventory?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface ProductCardSetting {
  cardBorderRadius?: string;
  cardBackground?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageRadius?: string;
  nameFontSize?: string;
  nameFontWeight?: string;
  nameColor?: string;
  descriptionFontSize?: string;
  descriptionFontWeight?: string;
  descriptionColor?: string;
  priceFontSize?: string;
  priceColor?: string;
  btnBackgroundColor?: string;
  btnColor?: string;
}

// these new interfaces for DetailPage

export interface DetailPageBlock {
  productId: number;
  imageSrc: string[];
  imageAlt: string[];
  name: string;
  description: string;
  category: string;
  price: string;
  status: string;
  discount: string;
  id: string;
  inventory: number;
  btnText: string;
  btnLink: string;
  setting: {
    imageWidth: string;
    imageHeight: string;
    imageRadius: string;
    productNameColor: string;
    productNameFontSize: string;
    productNameFontWeight: string;
    priceColor: string;
    priceFontSize: string;
    descriptionColor: string;
    descriptionFontSize: string;
    btnBackgroundColor: string;
    btnTextColor: string;
    // [key: string]: any; // Allows dynamic properties
  };
}

export interface DetailPageSettings {
  imageWidth: string;
  imageHeight: string;
  imageRadius: string;
  productNameColor: string;
  productNameFontSize: string;
  productNameFontWeight: string;
  statusColor: string;
  statusFontSize: string;
  categoryColor: string;
  categoryFontSize: string;
  priceColor: string;
  priceFontSize: string;
  descriptionColor: string;
  descriptionFontSize: string;
  btnBackgroundColor: string;
  btnTextColor: string;
  paddingTop: string;
  paddingBottom: string;
  marginTop: string;
  marginBottom: string;
  backgroundColor: string;
  // [key: string]: any; // Allows dynamic properties
}

export interface DetailPageSection {
  type: "DetailPage";
  blocks: DetailPageBlock[];
  setting: DetailPageSettings;
}

export interface DetailPageChildren {
  type: "DetailPage";
  sections: DetailPageSection[];
  order: string[];
}
// export interface DetailPageMain {
//   children: DetailPageChildren;
// }

export interface CollectionBlockSetting extends CommonSettings {
  headingColor: string;
  headingFontSize: string;
  headingFontWeight: string;
  productNameColor: string;
  priceColor: string;
  descriptionColor: string;
  btnBackgroundColor: string;
  btnTextColor: string;
  cardBackground: string;
  cardBorderRadius: string;
  imageRadius: string;
  // gridColumns: number;
  paddingTop: string;
  paddingBottom: string;
  marginTop: string;
  marginBottom: string;
  backgroundColor: string;
}

export interface CollectionProduct {
  id: string;
  imageSrc: string;
  imageAlt: string;
  name: string;
  description: string;
  price: string;
  btnText: string;
  btnLink: string;
}

export interface CollectionSection {
  type: "Collection";
  blocks: {
    heading: string;
    products: CollectionProduct[];
    setting: CollectionBlockSetting;
  };
  setting: CollectionBlockSetting;
}

export interface BlogBlock {
  blogId: number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  author: string;
  date: string;
  btnText: string;
  btnLink: string;
}

export interface BlogListSetting {
  gridColumns: number;
  paddingTop: string | number;
  paddingBottom: string | number;
  marginTop: string | number;
  marginBottom: string | number;
  backgroundColor: string;
  cardBackgroundColor: string;
  cardBorderRadius: string;
  textColor: string;
  btnBackgroundColor: string;
  buttonColor: string;
}
export interface BlogListFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<BlogSection>>;
  userInputData: BlogSection;
  layout: Layout;
  selectedComponent: string;
}
export interface BlogListSection {
  type: "BlogList";
  blocks: BlogBlock[];
  setting: BlogListSetting;
}
export interface BlogChildren {
  type: "BlogList";
  sections: BlogListSection[];
  order: string[];
}
export interface BlogSection {
  type: "BlogList";  // Changed from string to literal type
  blocks: BlogBlock[];
  setting: BlogListSetting;
}

// blog detail
export interface BlogDetailBlock {
  blogId: number;
  coverImage: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  publishDate: string;
  readTime: string;
  id: string;
  relatedPosts: {
    id: string;
    title: string;
    thumbnail: string;
  }[];
  socialShare: {
    twitter: boolean;
    facebook: boolean;
    linkedin: boolean;
    telegram: boolean;
  };
}

export interface BlogDetailBlockSetting extends CommonSettings {
  coverImageWidth: string;
  coverImageHeight: string;
  imageRadius: string;
  titleColor: string;
  titleFontSize: string;
  titleFontWeight: string;
  subtitleColor: string;
  subtitleFontSize: string;
  contentColor: string;
  contentFontSize: string;
  contentLineHeight: string;
  authorNameColor: string;
  authorNameFontSize: string;
  categoryColor: string;
  categoryFontSize: string;
  tagsColor: string;
  tagsFontSize: string;
  dateColor: string;
  dateFontSize: string;
  readTimeColor: string;
  readTimeFontSize: string;
  sectionSpacing: string;
}

export interface BlogDetailSection {
  blocks: BlogDetailBlock[];
  setting: BlogDetailBlockSetting;
  type: "BlogDetail";
}
export interface BlogDetailChildren {
  type: "BlogDetail";
  sections: BlogDetailSection[];
  order: string[];
}
