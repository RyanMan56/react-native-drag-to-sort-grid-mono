import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Dimensions} from 'react-native';
import DraggableGrid from 'react-native-drag-to-sort-grid';
import DeleteButton from '../../common/components/DeleteButton';
import Tile from '../../common/components/Tile';
import colors from '../../common/helpers/colors';
import Styles from './styles';

const margin = 10;
const itemWidth = Dimensions.get('window').width / 2 - margin * 2;
const itemHeight = 200;
const deleteSize = 30;
const initialData = new Array(6).fill(null).map((_, i) => ({index: i}));

type TileType = {
  index: number;
};

function MainScreen() {
  const [data, setData] = useState(initialData);
  const initialOrder = useMemo(() => data.map((_, i) => i), [data]);
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback((index: number) => {
    console.log(index);
    setData(prev => prev.filter(item => item.index !== index));
    setLoading(true);
  }, []);

  console.log(data);

  // The loading step is where the app would typically submit the deletion request to the API. The app would then get the
  // re-ordered data as a response, and this would be used to re-initialize the draggable grid's sharedValues for the UI thread
  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [loading]);

  return (
    <Styles.Wrapper>
      {loading ? (
        <Styles.LoadingWrapper>
          <ActivityIndicator color={colors.darkBlue} size="large" />
        </Styles.LoadingWrapper>
      ) : (
        <DraggableGrid<TileType>
          data={data}
          initialOrder={initialOrder}
          renderItem={item => (
            <Tile width={itemWidth} height={itemHeight} index={item.index} />
          )}
          deleteRenderItem={item => (
            <DeleteButton
              size={deleteSize}
              onPress={() => handleDelete(item.index)}
            />
          )}
          deleteStyle={{top: -deleteSize / 2}}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          itemMargin={margin}
          offsetY={margin}
        />
      )}
    </Styles.Wrapper>
  );
}

export default MainScreen;
