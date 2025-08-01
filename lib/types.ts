import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Interpolation } from "styled-components";
import { Substitute } from "styled-components/dist/types";

export interface Link {
  megaMenu: MegaMenuItem[];
  name: string;
  url: string;
}
export interface BrandsBlockSettings extends CommonSettings {
  headingColor: string;
  headingFontSize: string;
  headingFontWeight: string;
  brandNameColor: string;
  brandNameFontSize: string;
  brandNameFontWeight: string;
  logoWidth: number;
  logoHeight: number;
  cardBackground: string;
  brandAnimation?: AnimationConfig;
  navAnimation?: AnimationEffect; // Add this line for navigation button animations
}

export interface ColorSchema {
  primary: string;
  secondary: string;
  text: string;
}

export interface CollapseBlockSetting extends CommonSettings {
  headerAnimation?: AnimationEffect;
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
  borderRadius?: string;
  border: string;
  textColor1?: string;
  textColor2?: string;
  textColor3?: string;
  textColor4?: string;
  contentColor1?: string;
  contentColor2?: string;
  contentColor3?: string;
  contentColor4?: string;
  animation?: AnimationEffect;
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
  searchBarBorderColor: string;
  searchBarBorderRadius: string;
  buttonBorderColor: string;
  buttonBorderRadius: string;
  locationButtonBgColor: string;
  locationButtonTextColor: string;
  announcementText: string;
  announcementBgColor: string;
  announcementTextColor: string;
  announcementFontSize: string;
  bgColor: string;
  gap: string;
  megaMenuBg: string;
  categoryItemColor: string;
  categoryItemSize: string;
  categoryItemHoverColor: string;
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
    paddingLeft: string;
    paddingRight: string;
    marginTop: string;
    marginBottom: string;
    bgColor: string;
  };
}

interface MegaMenuItem {
  title: string;
  items: {
    name: string;
    url: string;
    image?: string;
  }[];
}

// interface LinkHeader {
//   name: string;
//   url: string;
//   megaMenu?: MegaMenuItem[];
// }
export interface AnimationSettings {
  animationType?: "fade" | "slide" | "zoom" | "none";
  animationDuration?: number;
  animationTiming?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  animationDelay?: number;
}

// Updated Animation interfaces for single animation
export interface AnimationConfig {
  type: string;
  duration: string;
  timing: string;
  delay?: string;
  iterationCount?: string;
}

// export interface AnimationEffect {
//   type: "hover" | "click";
//   animation: AnimationConfig;
// }

// Updated BannerBlockSettings with single animation
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
  animation?: AnimationEffect;
}
export interface AnimationState {
  isPlaying: boolean;
  currentEffect?: AnimationEffect;
  startTime?: number;
  duration?: number;
  progress?: number;
}

// Animation hook return type
export interface UseAnimationReturn {
  isAnimating: boolean;
  trigger: (type?: "hover" | "click") => void;
  stop: () => void;
  reset: () => void;
  state: AnimationState;
}
export interface BannerBlock {
  imageSrc: string;
  imageAlt: string;
  text: string;
  description: string;
  imageLink?: string;
  setting: BannerBlockSettings;
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
// Find this interface around line 95-115 and update it:
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
  // ADD these two lines:
  btnAnimation?: AnimationEffect;
  imageAnimation?: AnimationEffect;
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
export interface AboutBlock {
  heading?: string;
  description?: string;
  btnText?: string;
  imageSrc?: string;
  imageAlt?: string;
  btnLink?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  content1?: string;
  content2?: string;
  content3?: string;
  content4?: string;
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
  btnAnimation?: AnimationEffect; // Add this line for button animation support
  textHeadingColor?: Interpolation<
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
    lineHeight: string;
    lineTop: string;
    lineBottom: string;
    lineWidth: string;
    lineColor: string;
    btnAnimation?: AnimationEffect; // Add button animation support
  };
}

export interface RichTextSection {
  blocks: RichTextBlock;
  setting: CommonSettings;
  type: "rich-text";
}
export interface StoreSection {
  type: "store";
  blocks: {
    productId: number;
    imageSrc: string;
    imageAlt: string;
    name: string;
    description: string;
    price: string;
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
    };
  }[];
  setting: {
    gridColumns: number;
    paddingTop: string; // Changed from number to string
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
    marginTop: string;
    marginBottom: string;
    marginLeft: string;
    marginRight: string;
    backgroundColor: string;
    cardBackgroundColor: string;
    cardBorderRadius: string;
  };
}
export interface Section {
  setting: CommonSettings;
  blocks:
    | HeaderBlock
    | CollapseBlock
    | ImageTextBlock
    | MultiColumnBlock
    | NewsLetterBlock
    | RichTextBlock
    | GalleryBlock
    | AboutBlock
    | StoreSection["blocks"] // Add store blocks
    | BlogSection["blocks"] // Add blog blocks
    | BlogDetailSection["blocks"] // Add blog detail blocks
    | DetailPageSection["blocks"]; // Add detail page blocks
  type: string;
}

// Update the ImageTextBlockSetting interface to include animations
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
  imageAnimation?: AnimationEffect; // Add image animation support
  buttonAnimation?: AnimationEffect; // Add button animation support
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
    phoneNumber: string;
    textNumber: string;
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
  trustIconBackground: string;
  trustIconColor: string;
  trustItemSize: string;
  trustItemColor: string;
  scrollButtonBg: string;
  scrollButtonColor: string;
  categoryColor: string;
  linkColor: string;
  logoWidth: string;
  logoHeight: string;
  logoRadius: string;
  backgroundColor: string;
  categoryBg: string;
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
  btnAnimation?: AnimationEffect; // Add button animation support
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
  metaData?: {
    title?: string;
    description?: string;
  };
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
    find(arg0: (section: Section) => boolean): Section | undefined;
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
  imageAnimation?: AnimationEffect;
  btnAnimation?: AnimationEffect;
  navAnimation?: AnimationEffect;
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
    btnBackgroundColor: string;
    btnTextColor: string;
    // Add these animation properties:
    imageAnimation?: AnimationEffect;
    btnAnimation?: AnimationEffect;
    navAnimation?: AnimationEffect;
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
  titleColor?: string;
  titleFontWeight?: string;
  titleFontSize?: string;
  backgroundColorMultiRow?: string;
  backgroundColorBox?: string;
  imageRadius?: string;
  imageWidth?: string;
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
  buttonAnimation?: AnimationEffect;
  imageAnimation?: AnimationEffect;
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
  blocks: MultiRowBlock[] | { [key: number]: MultiRowBlock };
  setting: MultiRowBlockSetting;
}

export interface MultiRowFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<MultiRowSection>>;
  userInputData: MultiRowSection;
  layout: Layout;
  selectedComponent: string;
}
export interface FooterFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<FooterSection>>;
  userInputData: FooterSection;
  layout: Layout;
  selectedComponent: string;
}

export interface AboutChildren {
  metaData?: {
    title: string;
    description: string;
  };
  sections: Array<
    | {
        type: "NewsLetter";
        blocks: {
          heading: string;
          btnText: string;
          setting: NewsLetterBlockSetting;
        };
        setting: CommonSettings;
      }
    | {
        type: "CollapseFaq";
        blocks: Array<{
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
        }>;
        setting: CommonSettings;
      }
    | {
        type: "MultiColumn";
        blocks: Array<{
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
        }>;
        setting: MultiColumnBlockSetting;
      }
    | {
        type?: "MultiRow";
        title?: string;
        blocks?: Array<{
          heading?: string;
          description?: string;
          btnLable?: string;
          btnLink?: string;
          imageSrc?: string;
          imageAlt?: string;
        }>;
        setting: MultiRowBlockSetting;
      }
  >;
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

export interface ProductBlockSetting {
  gridColumns: number;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  marginTop: string;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  cardBorderRadius: string;
  filterButtonBg: string;
  filterButtonTextColor: string;
  filterRowBg: string;
  filterNameColor: string;
  filterCardBg: string;
  btnBackgroundColor: string;
  btnTextColor: string;
  textColor: string;
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
  storeId: string;
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

export interface ProductCard {
  blocks: ProductListSection[];
  setting: ProductBlockSetting;
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
export interface DetailPageBlockSettings {
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
}
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
  category?: {
    name: string;
    _id: string;
  };
  discount?: string;
  status?: string;
  inventory?: string;
  createdAt?: string;
  updatedAt?: string;
  storeId?: string;
  _id?: string;
  properties?: string;
  colors: { code: string; quantity: string }[];
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
  };
}

export interface DetailPageSettings extends CommonSettings {
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
  paddingLeft: string;
  paddingRight: string;
  marginTop: string;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  backgroundColor: string;
  boxRadius: string;
  backgroundColorBox: string;
  propertyKeyColor: string;
  propertyValueColor: string;
  propertyBg: string;
}

export interface DetailPageSection {
  type: "DetailPage";
  blocks: DetailPageBlock[];
  setting: DetailPageSettings;
}

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
  paddingTop: string;
  paddingBottom: string;
  marginTop: string;
  marginBottom: string;
  backgroundColor: string;
  navAnimation?: AnimationEffect; // Add this line for navigation button animations
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
  type: string;
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
  paddingTop: string;
  paddingBottom: string;
  marginTop: string;
  marginBottom: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  cardBorderRadius: number;
  btnBackgroundColor: string;
  buttonColor: string;
  paddingLeft: string;
  paddingRight: string;
  marginRight: string;
  marginLeft: string;
}
export interface BlogListFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<BlogSection>>;
  userInputData: BlogSection;
  layout: Layout;
  selectedComponent: string;
}
export interface BlogListSection {
  type: string;
  blocks: BlogBlock[];
  setting: BlogListSetting;
}
export interface BlogChildren {
  type?: string; // Make type optional since it's at the parent level
  metaData: {
    title: string;
    description: string;
  };
  sections: {
    type: string;
    blocks: {
      blogId: number;
      imageSrc: string;
      imageAlt: string;
      title: string;
      description: string;
      author: string;
      date: string;
      btnText: string;
    }[];
    setting: BlogListSetting;
  }[];
  order: string[];
}
export interface BlogSection {
  type: string; // Changed from string to literal type
  metaData?: {
    title: string;
    description: string;
  };
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
  metaColor: string;
  metaFontSize: string;
}

export interface BlogDetailSection {
  blocks: BlogDetailBlock[];
  setting: BlogDetailBlockSetting & {
    animation?: AnimationEffect;
    coverImage?: string;
  };
  type: "BlogDetail";
}

export interface DetailPageChildren {
  type: string;
  metaData: {
    title: string;
    description: string;
  };
  sections: DetailPageSection[];
  order: string[];
}

export interface StoreChildren {
  type?: string; // Make type optional since it's at the parent level
  metaData: {
    title: string;
    description: string;
  };
  sections: {
    type: string;
    blocks: {
      productId: number;
      imageSrc: string;
      imageAlt: string;
      name: string;
      description: string;
      price: string;
      btnText: string;
      btnLink: string;
    }[];
    setting: ProductBlockSetting;
  }[];
  order: string[];
}

export interface BlogDetailChildren {
  type: string;
  metaData: {
    title: string;
    description: string;
  };
  sections: BlogDetailSection[];
  order: string[];
}

// Add these new type guards
export interface LayoutResponse {
  children: {
    type: string;
    sections: Section[];
    order: string[];
  };
}

export interface RouteLayout {
  about: AboutChildren;
  contact: AboutChildren;
  store: StoreChildren;
  DetailPage: DetailPageChildren;
  BlogList: BlogChildren;
  BlogDetail: BlogDetailChildren;
  home: Children;
}
export interface SpecialOfferBlockSetting extends CommonSettings {
  gridColumns: number;
  imageRadius: string;
  productNameColor: string;
  priceColor: string;
  descriptionColor: string;
  btnBackgroundColor: string;
  btnTextColor: string;
  cardBackground: string;
  cardBorderRadius: string;
  selectedCollection: string;
  headingColor: string;
  headingFontSize: string;
  headingFontWeight: string;
  navAnimation?: AnimationEffect; // Add this line for navigation button animations
}

export interface GalleryImage {
  imageSrc: string;
  imageAlt: string;
  imageLink?: string;
}

export interface GalleryBlockSetting {
  imageAnimation: AnimationEffect;
  titleColor: string;
  titleFontSize: string;
  titleFontWeight: string;
  descriptionColor: string;
  descriptionFontSize: string;
  descriptionFontWeight: string;
  background: string;
  imageWidth: string;
  imageHeight: string;
  imageRadius: string;
  gridColumns: string;
  gridGap: string;
}

export interface GalleryBlock {
  title: string;
  description: string;
  images: GalleryImage[];
  setting: GalleryBlockSetting;
}

export interface GallerySectionSetting {
  paddingTop: string;
  paddingBottom: string;
  marginTop: string;
  marginBottom: string;
  paddingLeft: string;
  paddingRight: string;
  backgroundColor: string;
}

export interface SpecialOfferBlock {
  textHeading: string;
  products: SpecialOfferSection[];
  setting: SpecialOfferBlockSetting;
}

export interface SpecialOfferSection {
  type: "SpecialOffer";
  blocks: SpecialOfferBlock;
  setting: SpecialOfferBlockSetting;
}
export interface StoryBlockSetting extends CommonSettings {
  storyRingColor: string;
  viewedRingColor: string;
  titleColor: string;
  titleFontSize: string;
  titleFontWeight: string;
  imageWidth: string;
  imageHeight: string;
  imageRadius: string;
  imageAnimation?: AnimationEffect; // Add this line for story image animations
}

export interface StoryBlock {
  stories: {
    id: string;
    imageUrl: string;
    title: string;
    link: string;
  }[];
  setting: StoryBlockSetting;
}

export interface StorySection {
  type: "Story";
  blocks: StoryBlock;
  setting: CommonSettings;

  paddingRight: string;
  paddingLeft: string;
}

export interface GallerySection {
  type: "Gallery";
  blocks: GalleryBlock;
  setting: GallerySectionSetting;
}
// Update the SlideBannerBlockSetting interface to include navAnimation
export interface SlideBannerBlockSetting extends CommonSettings {
  autoplay: boolean;
  autoplaySpeed: number;
  slideTransition: string;
  navigationStyle: string;
  arrowsPosition: string;
  opacityImage: string;
  imageRadious: string;
  imageBehavior: string;
  height: string;
  bgArrow: string;
  activeDotColor: string;
  inactiveDotColor: string;
  navAnimation?: AnimationEffect; // Add this line for navigation button animations
}

export interface SlideItem {
  imageSrc: string;
  imageAlt: string;
  heading: string;
  description: string;
  link: string;
}

export interface SlideBannerBlock {
  slides: SlideItem[];
  setting: SlideBannerBlockSetting;
}

export interface SlideBannerSection {
  type: "SlideBanner";
  blocks: SlideBannerBlock;
  setting: CommonSettings;
}

export interface OfferRowBlockSetting extends CommonSettings {
  selectedCollection: string;
  titleColor: string;
  titleText: string;
  buttonColor: string;
  buttonTextColor: string;
  gradientFromColor: string;
  gradientToColor: string;
  buttonText: string;
  buttonLink: string;
  imageAnimation?: AnimationEffect; // Add image animation support
  buttonAnimation?: AnimationEffect; // Add button animation support
}

export interface OfferItem {
  _id: string;
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: {
    imageSrc: string;
    imageAly: string;
  };
}

export interface OfferRowBlock {
  offers: OfferItem[];
  setting: OfferRowBlockSetting;
}

export interface OfferRowSection {
  type: "OfferRow";
  blocks: OfferRowBlock;
  setting: CommonSettings & {
    buttonText: string;
    buttonLink: string;
    gradientFromColor: string;
    gradientToColor: string;
  };
}
export interface BrandItem {
  id: number;
  name: string;
  logo: string;
  link: string;
}

export interface BrandsBlockSetting extends CommonSettings {
  navAnimation: AnimationEffect;
  headingColor: string;
  headingFontSize: string;
  headingFontWeight: string;
  brandNameColor: string;
  brandNameFontSize: string;
  brandNameFontWeight: string;
  cardBackground: string;
  cardBorderRadius: string;
  cardHoverShadow: string;
  gridColumns: string;
  logoWidth: string;
  logoHeight: string;
}

export interface BrandsBlock {
  heading: string;
  brands: BrandItem[];
  setting: BrandsBlockSetting;
}

export interface BrandsSection {
  type: "Brands";
  blocks: BrandsBlock;
  setting: CommonSettings;
}
export interface ProductRowBlockSetting extends CommonSettings {
  gridColumns: number;
  imageRadius: string;
  productNameColor: string;
  priceColor: string;
  descriptionColor: string;
  btnBackgroundColor: string;
  btnTextColor: string;
  cardBackground: string;
  cardBorderRadius: string;
  headingColor: string;
  headingFontSize: string;
  headingFontWeight: string;
  selectedCollection: string;
  navAnimation?: AnimationEffect; // Add this line for navigation button animations
}

export interface ProductRowBlock {
  textHeading: string;
  products: ProductRowSection[];
  setting: ProductRowBlockSetting;
}

export interface ProductRowSection {
  type: "ProductRow";
  blocks: ProductRowBlock;
  setting: ProductRowBlockSetting;
}
export interface CanvasElement {
  id: string;
  type: "heading" | "paragraph" | "image" | "button" | "link" | "div";
  content?: string;
  style: CanvasElementStyle;
  href?: string;
  src?: string;
  alt?: string;
  animation?: AnimationEffect; // Add animation support
}

export interface CanvasEditorSection {
  type: string;
  setting: {
    paddingTop: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
    marginTop: string;
    marginBottom: string;
    backgroundColor: string;
  };
  blocks: {
    elements: CanvasElement[];
    setting: {
      canvasWidth: string;
      canvasHeight: string;
      backgroundColor: string;
      gridSize: number;
      showGrid: boolean;
    };
  };
}
// UPDATE this existing interface
export interface AnimationConfig {
  type: string;
  duration: string;
  timing: string;
  delay?: string;
  iterationCount?: string;
  intensity?: "light" | "normal" | "strong"; // ADD this line
}

export interface AnimationEffect {
  type: "hover" | "click"; // ADD 'scroll' and 'load'
  animation: AnimationConfig;
  navAnimation?: AnimationConfig; // ADD this for navigation button animations
  trigger?: {
    threshold?: number; // ADD this for scroll animations
  };
}

export interface AnimationSettings {
  effect?: AnimationEffect; // Changed from effects array to single effect
}

// Update BannerBlockSetting interface
export interface BannerBlockSetting extends CommonSettings {
  textColor?: string;
  textFontSize?: string;
  textFontWeight?: string;
  descriptionColor?: string;
  descriptionFontSize?: string;
  descriptionFontWeight?: string;
  backgroundColorBox?: string;
  backgroundBoxRadious?: string;
  opacityImage?: string;
  opacityTextBox?: string;
  imageRadious?: string;
  imageBehavior?: string;
  animations?: AnimationSettings; // Single animation
}
export interface CanvasElementStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string; // Can be hex or rgba
  backgroundColor?: string; // Can be hex or rgba
  borderRadius?: number;
  padding?: number;
  textAlign?: "left" | "right" | "center" | "justify" | "start" | "end";
  zIndex?: number;
}
