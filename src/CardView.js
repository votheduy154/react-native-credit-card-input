import React, { Component, PropTypes } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

import _ from 'lodash'
import defaultIcons from "./Icons";
import FlipCard from "react-native-flip-card";

const BASE_SIZE = { width: 300, height: 185 };

const s = StyleSheet.create({
  cardContainer: {},
  cardFace: {},
  icon: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  baseText: {
    color: '#16A556',
    backgroundColor: "transparent",
  },
  placeholder: {
    color: "#757575",
  },
  focused: {
    fontWeight: "bold",
    color: "#16A556",
  },
  number: {
    fontSize: 21,
    position: "absolute",
    top: 95,
    left: 28,
  },
  name: {
    fontSize: 16,
    position: "absolute",
    bottom: 20,
    left: 25,
    right: 100,
  },
  expiryLabel: {
    fontSize: 13,
    position: "absolute",
    bottom: 40,
    left: 215,
  },
  numberCardLabel: {
    fontSize: 13,
    position: "absolute",
    top: 75,
    left: 25,
  },
  nameCardLabel: {
    fontSize: 13,
    position: "absolute",
    bottom: 40,
    left: 25,
  },
  expiry: {
    fontSize: 16,
    position: "absolute",
    bottom: 20,
    left: 220,
  },
  amexCVC: {
    fontSize: 16,
    position: "absolute",
    top: 73,
    right: 30,
  },
  cvc: {
    fontSize: 16,
    position: "absolute",
    top: 90,
    right: 32,
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CardView extends Component {
  static propTypes = {
    focused: PropTypes.string,

    brand: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    placeholder: PropTypes.object,

    scale: PropTypes.number,
    fontFamily: PropTypes.string,
    imageFront: PropTypes.number,
    imageBack: PropTypes.number,
    customIcons: PropTypes.object,
  };

  static defaultProps = {
    name: "",
    placeholder: {
      number: "---- ---- ---- ----",
      name: "FULL NAME",
      expiry: "MM/YY",
      cvc: "•••",
    },

    scale: 1,
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    imageFront: require("../images/card-front.png"),
    imageBack: require("../images/card-back.png"),
  };

  render() {
    const { focused,
      brand, name, number, expiry, cvc, customIcons,
      placeholder, imageFront, imageBack, scale, fontFamily } = this.props;
    let realNumber = null
    const Icons = { ...defaultIcons, ...customIcons };
    const isAmex = brand === "american-express";
    const shouldFlip = !isAmex && focused === "cvc";

    const containerSize = { ...BASE_SIZE, height: BASE_SIZE.height * scale };
    const transform = { transform: [
      { scale },
      { translateY: ((BASE_SIZE.height * (scale - 1) / 2)) },
    ] };
    if(number){
      const splitHolder = _.split(placeholder.number,' ')
      const splitNumber = _.split(number,' ')
      const returnNumber = []

      _.map(splitNumber,(value, index)=>{
         // console.log(value)
        if(4 - value.length === 0){
          splitHolder[index] = value
        }
        if(4 - value.length === 1){
          splitHolder[index] = value+'-'
        }
        if(4 - value.length === 2){
          splitHolder[index] = value+'--'
        }
        if(4 - value.length === 3){
          splitHolder[index] = value+'---'
        }
      })

      realNumber = _.join(splitHolder,' ')

    }

    return (
      <View style={[s.cardContainer, containerSize]}>
        <FlipCard style={{ borderWidth: 0 }}
            flipHorizontal
            flipVertical={false}
            friction={10}
            perspective={2000}
            clickable={false}
            flip={shouldFlip}>
          <Image style={[BASE_SIZE, s.cardFace, transform]}
              source={imageFront}>
              <Image style={[s.icon]}
                  source={{ uri: Icons[brand] }} />
            <Text style={[s.baseText, { fontFamily }, s.numberCardLabel, s.placeholder]}>
              Số thẻ
            </Text>
              <Text style={[s.baseText, { fontFamily }, s.number, !number && s.placeholder, focused === "number" && s.focused]}>
                { !number ? placeholder.number : realNumber }
              </Text>
              <Text style={[s.baseText, { fontFamily }, s.nameCardLabel, s.placeholder]}>
                Họ tên
              </Text>

              <Text style={[s.baseText, { fontFamily }, s.name, !name && s.placeholder, focused === "name" && s.focused]}
                  numberOfLines={1}>
                {/*{ !name ? placeholder.name : name.toUpperCase() }*/}
                { name.toUpperCase() }
              </Text>

              <Text style={[s.baseText, { fontFamily }, s.expiryLabel, s.placeholder, focused === "expiry" && s.focused]}>
                Hết hạn
              </Text>
              <Text style={[s.baseText, { fontFamily }, s.expiry, !expiry && s.placeholder, focused === "expiry" && s.focused]}>
                { !expiry ? placeholder.expiry : expiry }
              </Text>
              { isAmex &&
                  <Text style={[s.baseText, { fontFamily }, s.amexCVC, !cvc && s.placeholder, focused === "cvc" && s.focused]}>
                    { !cvc ? placeholder.cvc : cvc }
                  </Text> }
          </Image>
          <Image style={[BASE_SIZE, s.cardFace, transform]}
              source={imageBack}>
              <Text style={[s.baseText, s.cvc, !cvc && s.placeholder, focused === "cvc" && s.focused]}>
                { !cvc ? placeholder.cvc : cvc }
              </Text>
          </Image>
        </FlipCard>
      </View>
    );
  }
}
