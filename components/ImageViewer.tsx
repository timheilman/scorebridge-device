import { Image, ImageSourcePropType, StyleSheet } from "react-native";
export interface ImageViewerParams {
  placeholderImageSource: ImageSourcePropType;
  selectedImage: string | null;
}
export default function ImageViewer({
  placeholderImageSource,
  selectedImage,
}: ImageViewerParams) {
  const imageSource = selectedImage
    ? { uri: selectedImage }
    : placeholderImageSource;

  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
