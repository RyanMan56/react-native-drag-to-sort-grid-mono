import React from 'react';
import {Text} from 'react-native';
import Styles from './styles';

type Props = {
  index: number;
  width: number;
  height: number;
};

function Tile({index, width, height}: Props) {
  return (
    <Styles.Wrapper style={{width, height}}>
      <Text>{`Tile: ${index}`}</Text>
    </Styles.Wrapper>
  );
}

export default Tile;
