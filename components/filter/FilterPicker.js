import React from 'react';
import AppFilterPicker from '../AppFilterPicker';

function FilterPicker({
  items,
  name,
  numberOfColumns,
  PickerItemComponent,
  placeholder,
  width,
}) {
  return (
    <>
      <AppFilterPicker
        items={items}
        numberOfColumns={numberOfColumns}
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        width={width}
      />
    </>
  );
}

export default FilterPicker;
