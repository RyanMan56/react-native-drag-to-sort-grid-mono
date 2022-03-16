import styled from 'styled-components/native';
import colors from '../../common/helpers/colors';

const Styles = {
  Wrapper: styled.View`
    flex: 1;
    background-color: ${colors.white};
  `,
  LoadingWrapper: styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
  `,
};

export default Styles;
