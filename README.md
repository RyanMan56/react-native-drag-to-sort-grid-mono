# React Native Drag to Sort Grid

This is a React Native package designed specifically to take advantage of the new React Native Reanimated 2 library. As a result, this package enables silky smooth gesture based animations that are capable of running at 60fps, even on an Android emulator running in debug mode. As a result, the performance of this package is substantially better than most other draggable grid packages available at the moment.

React Native Reanimated 2 offloads animations to the UI thread (as opposed to the JavaScript thread), which means the code for this package is written in a slightly different way than usual, to make use of worklets. Fortunately React Native Reanimated 2 allows us to write code in a more declarative way, and so the code is much more stylistically similar to typical React code.
 
 <img src="/example/gif.gif" height="650" alt="Example gif">

## React Native Drag to Sort Grid - API

This package was written using typescript, so comes with typescript definitions built-in. To use this package import `DraggableGrid` like this:

```
import DraggableGrid from 'react-native-drag-to-sort-grid';
```

Once imported, the `DraggableGrid` takes the following props, and can use generics like this `<DraggableGrid<YourItemType> />`

### Props

| Name               | Type                                     | Description                                                                                                                                                             | 
| ------------------ | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data               | (T & { index: number \| null })[]        | The data for each element, including the index of the element in the unsorted data array                                                                                |
| initialOrder       | number[]                                 | An array containing the initial order of each element in the unsorted data array (e.g. [1, 0] means data[1] is the first element, and data[0] is the second)            |
| itemWidth          | number                                   | The width of one grid tile                                                                                                                                              |
| itemHeight         | number                                   | The height of one grid tile                                                                                                                                             |
| itemMargin         | number                                   | The horizonal and vertical margin of each tile                                                                                                                          |
| offsetY            | number                                   | The Y offset applied to the top of the grid                                                                                                                             |
| renderItem         | (item: T, index: number) => JSX.Element  | Render prop to render the content of the tile. The data item is passed as a param                                                                                       |
| deleteRenderItem   | (item: T, index: number) => JSX.Element  | Render prop to render the delete button of the tile                                                                                                                     |
| deleteStyle        | ViewStyle                                | The style passed to the element that wraps the deleteRenderItem. A top, left, right or bottom should be used to position the deleteRenderItem                           |
| onOrderingFinished | (newOrder: number[]) => void             | Callback function which is called whenever the order of tiles is changed                                                                                                |

## Recommended usage

Whenever an element is deleted from the data array, the `DraggableGrid` component should be unmounted and then re-mounted, with a new `initialOrder` passed as a prop. This is so that the internal order SharedValue can be reinitialised correctly.
The justification for this design decision is that if this were to be attempted using a `useEffect` inside the `DraggableGrid` component then this update would be a few frames out of sync, resulting in janky visuals and potentially crashes depending on how this package is being used. This is caused by the animations taking place on the UI thread instead of the JavaScript thread.

## Running the example 
1. Clone this repo
2. `cd react-native-drag-to-sort-grid-mono/example`
3. Run `yarn`
4. Run `npx pod-install`
5. Run `yarn ios` or `yarn android`

