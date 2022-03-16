import { ViewStyle } from "react-native";

declare type Props<T> = {
  data: (T & { index: number | null })[];
  initialOrder: number[];
  itemWidth: number;
  itemHeight: number;
  itemMargin: number;
  offsetY: number;
  renderItem: (item: T, index: number) => JSX.Element;
  deleteRenderItem: (item: T, index: number) => JSX.Element;
  deleteStyle?: ViewStyle;
  onOrderingFinished?: (newOrder: number[]) => void;
};

export default function DraggableGrid<T>(props: Props<T>): JSX.Element;
