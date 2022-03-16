import React from 'react';
import {Button, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Styles from './styles';

type Props = {
  size: number;
  onPress: () => void;
};

function DeleteButton({size, onPress}: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Styles.Wrapper
        style={{width: size, height: size, borderRadius: size / 2}}>
        <Text>X</Text>
      </Styles.Wrapper>
    </TouchableOpacity>
  );
}

export default DeleteButton;
