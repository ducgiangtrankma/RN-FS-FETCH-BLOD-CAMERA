import React, {useState, useRef} from 'react';
import {
  Text,
  SafeAreaView,
  Alert,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
export default function App(props) {
  const bs = useRef();
  const [images, setImages] = useState([]);
  const [isPick, setIsPick] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleUpload = () => {
    if (images.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 1 ảnh và thử lại');
      return;
    }
    setIsUploadingImage(true);
    const config = {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTk3NjY4Mzg0LCJleHAiOjE2MDAyNjAzODR9.rb2GSLwUZFrCd-MNjo_63UO7S6JxJp-oqBbewkh-Zpk',
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: function (progressEvent) {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        console.log(percentCompleted);
        setUploadProgress(percentCompleted);
      },
    };
    const data = new FormData();
    data.append('field', 'image');
    images.forEach((item) => {
      data.append('files', {
        type: 'image/jpg',
        uri: item.path,
        name: `image${Date.now()}`,
      });
    });

    // axios
    //   .post('http://evn.thienthaitechnology.vn:1337/upload', data, config)
    //   .then((response) => {
    //     console.log('response: ', response);
    //     setImages([]);
    //     Alert.alert('Thông báo', 'Đăng ảnh Thành Công!');
    //   })
    //   .catch((error) => {
    //     console.log('error: ', error.response);
    //     Alert.alert('Thông báo', 'Đăng ảnh Thất bại!');
    //   })
    //   .finally(() => {
    //     setIsUploadingImage(false);
    //   });
  };

  const renderImage = ({item, index}) => {
    return (
      <View>
        <Image
          source={{uri: item.path}}
          style={{
            height: 117,
            width: 117,
            marginRight: 3,
          }}
        />
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={() => handleDelImage(index)}>
          <Text style={{color: '#fff'}}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const handlePickerImage = () => {
    ImagePicker.openPicker({
      multiple: true,
    })
      .then((imgs) => {
        console.log(images);
        let paths = [];
        imgs.forEach((i) => {
          paths.push(i);
        });
        setImages([...images, ...paths]);
        bs.current.snapTo(1);
      })
      .then(() => setIsPick(!isPick));
  };
  const handleDelImage = (index) => {
    let imgs = Array(...images);
    imgs.splice(index, 1);
    setImages(imgs);
  };
  const handleOpenCamera = () => {
    //CHUP ANH
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
    });
  };
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={handlePickerImage}>
        <Text>Chon anh</Text>
      </TouchableOpacity>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={{marginTop: 50}}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  buttonDelete: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
