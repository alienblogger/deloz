import React from "react";

export default function SortingFields(props) {
  const {
    data,
    styleClass,
    onClickHandler,
    activeItem,
    activeClass,
    order
  } = props;

  const mappedList = data.map(function(item) {
    let ai = activeItem;
    //Decide Active Element
    ai=activeItem.split('_');
    let activeStyle = item.toLowerCase().includes(ai[0])
      ? activeClass
      : "";
    return (
      <div
        key={item + "adwad"}
        className={styleClass + " " + activeStyle}
        onClick={onClickHandler}
      >
        {item}
      </div>
    );
  });
  return mappedList;
}
