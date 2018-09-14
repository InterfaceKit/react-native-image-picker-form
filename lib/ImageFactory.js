/* @flow */

import React from 'react';
import {
  ActionSheetIOS,
  View,
  Text,
  Button,
  Animated,
  StyleSheet,
  Platform
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import t from 'tcomb-form-native';
import BottomSheet from 'react-native-js-bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  title: string
};
type State = {
  image: ?string
};

const Component = t.form.Component;

class ImageFactory extends Component<Props, State> {
  bottomSheet: BottomSheet;

  constructor(props: Props) {
    super(props);
    this.state = {
      image: undefined,
      height: new Animated.Value(0),
      overflow: 'visible'
    };
  }

  _onPressImage = () => {
    const options = this.props.options.config.options || [
      'Open camera',
      'Select from the gallery',
      'Cancel'
    ];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2
      },
      (buttonIndex: number) => {
        if (buttonIndex === 0) {
          ImagePicker.openCamera({}).then((image: Object) =>
            this._getImageFromStorage(image.path)
          );
        } else if (buttonIndex === 1) {
          ImagePicker.openPicker({}).then((image: Object) =>
            this._getImageFromStorage(image.path)
          );
        }
      }
    );
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return true;
  }

  _startAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.height, {
        toValue: 0,
        duration: 250
      }),
      Animated.timing(this.state.height, {
        toValue: 150,
        duration: 500,
        delay: 75
      })
    ]).start();
  };

  _renderOptions = (): Array<Object> => {
    const options = this.props.options.config.options || [
      'Open camera',
      'Select from the gallery',
      'Cancel'
    ];

    return [
      {
        title: options[0],
        onPress: () =>
          ImagePicker.openCamera({}).then((image: Object) =>
            this._getImageFromStorage(image.path)
          ) && this.bottomSheet.close(),
        icon: (
          <MaterialIcons name={'photo-camera'} size={24} style={styles.icon} />
        )
      },
      {
        title: options[1],
        onPress: () =>
          ImagePicker.openPicker({}).then((image: Object) =>
            this._getImageFromStorage(image.path)
          ) && this.bottomSheet.close(),
        icon: (
          <MaterialIcons name={'photo-library'} size={24} style={styles.icon} />
        )
      }
    ];
  };

  _getImageFromStorage = (path: string) => {
    this.setState({ image: path, overflow: 'hidden' }, () =>
      this._startAnimation()
    );
    super.getLocals().onChange(path);
  };

  getTemplate() {
    return (locals: Object) => {
      const stylesheet = locals.stylesheet;
      let formGroupStyle = stylesheet.formGroup.normal;
      let controlLabelStyle = stylesheet.controlLabel.normal;
      let textboxStyle = stylesheet.textbox.normal;
      let helpBlockStyle = stylesheet.helpBlock.normal;
      let errorBlockStyle = stylesheet.errorBlock;
      let topContainer = stylesheet.imagePicker
        ? stylesheet.imagePicker.topContainer
        : styles.topContainer;
      let container = stylesheet.imagePicker
        ? stylesheet.imagePicker.container
        : styles.container;
      let cameraColor =
        locals.config && locals.config.cameraColor
          ? locals.config.cameraColor
          : '#333';
      let buttonTextColor =
        locals.config && locals.config.buttonTextColor
          ? locals.config.buttonTextColor
          : '#333';

      if (locals.hasError) {
        controlLabelStyle = stylesheet.controlLabel.error;
        formGroupStyle = stylesheet.formGroup.error;
        textboxStyle = stylesheet.textbox.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

      const style: Object = this.props.options.config.style || {};
      return (
        <View style={this.props.options.config.containerStyle || {}}>
          {locals.label ? (
            <Text
              style={[
                controlLabelStyle,
                locals.error ? { color: '#a94442' } : {}
              ]}>
              {locals.label}
            </Text>
          ) : null}
          <View
            style={[
              topContainer,
              locals.hasError ? { borderColor: '#a94442' } : {}
            ]}>
            <Animated.Image
              resizeMode="cover"
              source={{
                uri: this.state.image
              }}
              style={[
                styles.image,
                {
                  height: this.state.height
                }
              ]}
            />
            <View
              style={[
                { overflow: this.state.overflow },
                container,
                locals.hasError ? { backgroundColor: '#E28E8E' } : {}
              ]}>
              <SimpleLineIcons
                name={'camera'}
                size={28}
                style={styles.icon}
                color={cameraColor}
              />
            </View>
          </View>
          <Button
            onPress={
              Platform.OS === 'ios'
                ? this._onPressImage
                : () => this.bottomSheet.open()
            }
            color={buttonTextColor}
            title={locals.config.title}
          />
          {locals.help || locals.config.help ? (
            <Text style={helpBlockStyle}>
              {locals.help || locals.config.help}
            </Text>
          ) : null}
          {Platform.OS === 'android' ? (
            <BottomSheet
              ref={(ref: any) => {
                this.bottomSheet = ref;
              }}
              title={locals.config.title}
              options={this._renderOptions()}
              coverScreen={true}
              titleFontFamily={style.titleFontFamily}
              styleContainer={style.styleContainer}
              fontFamily={style.fontFamily}
            />
          ) : null}
        </View>
      );
    };
  }
}

const styles = StyleSheet.create({
  topContainer: {
    overflow: 'hidden',
    borderRadius: 4,
    marginBottom: 12,
    height: 150,
    borderColor: 'grey',
    borderWidth: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6e6e6',
    height: 100,
    borderRadius: 4
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  image: {
    height: 150
  }
});

export default ImageFactory;
