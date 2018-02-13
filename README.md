# react-native-image-picker-form

<p>
<img src="https://img.shields.io/npm/dm/react-native-image-picker-form.svg" />
<img src="https://img.shields.io/npm/dt/react-native-image-picker-form.svg" />
</p>

A React Native component factory to use with [`tcomb-form-native`](https://github.com/gcanti/tcomb-form-native) library. Currently using [`react-native-image-crop-picker`](https://github.com/ivpusic/react-native-image-crop-picker) to provide image selection.

<p align="center">
<img src="https://raw.githubusercontent.com/wiki/InterfaceKit/react-native-image-picker-form/images/ios.gif" alt="Image factory" width="442">
<img src="https://raw.githubusercontent.com/wiki/InterfaceKit/react-native-image-picker-form/images/android.gif" alt="Image factory">
</p>

## Getting started

```sh
$ yarn add react-native-image-picker-form
```

After that, follow the instructions on: https://github.com/ivpusic/react-native-image-crop-picker#install

## Usage

When configuring your `tcomb-form-native` form, use the `factory` option to set as `SelectImageFactory`.
You can change the text displayed on ActionSheet or BottomSheet setting a options value or change the title with title option on `config`.

Default locale is `en-US`:

```js
import React from 'react-native'
import t from 'tcomb-form-native'
import ImageFactory from 'react-native-image-picker-form'

const Form = t.form.Form
const DocumentFormStruct = t.struct({
  image: t.String
})

type Props = {}
type State = {
  value: Object,
  options: Object
}

class App extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      value: {},
      options: {
        fields: {
          image: {
            config: {
              title: 'Select image',
              options: ['Open camera', 'Select from gallery', 'Cancel']
              // Used on Android to style BottomSheet
              style: {
                titleFontFamily: 'Roboto'
              }
            },
            error: 'No image provided',
            factory: ImageFactory
          }
        }
      }
    }
  }

  render() {
    return (
      <Form
        ref={(ref: any) => {
          this.form = ref
        }}
        type={DocumentFormStruct}
        value={this.state.value}
        options={this.state.options}
      />
    )
  }
}
```

## License

MIT License

Copyright (c) 2018 InterfaceKit

## Author

Antonio Moreno Valls `<amoreno at apsl.net>`

Built with 💛 by [APSL](https://github.com/apsl).
