import React, { useState, useContext, useEffect } from "react";
import { AutoComplete, Input } from "antd";
import { StoreContext } from "./../../Store/data";
const Search = () => {
  const { window } = useContext(StoreContext);
  const [width, setWidth] = useState(20);
  const [options, setOptions] = useState([
    { value: "Burns Bay Road" },
    { value: "Downing Street" },
    { value: "Wall Street" },
  ]);
  const handleSearch = (value) => {
    //setOptions(value ? searchResult(value) : []);
  };
  useEffect(() => {
    if (window.innerWidth >= 1080) {
      setWidth(50);
    } else if (window.innerWidth >= 720) {
      setWidth(40);
    } else if (window.innerWidth >= 420) {
      setWidth(30);
    } else {
      setWidth(20);
    }
  }, [window]);

  const onSelect = (value) => {
    console.log("onSelect", value);
  };
  return (
    <div className="search">
      <AutoComplete
        style={{ width: `${width}vw` }}
        dropdownClassName="search__div"
        options={options}
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        onSelect={onSelect}
        onSearch={handleSearch}
      >
        <Input.Search size="medium" placeholder="Search here..." enterButton />
      </AutoComplete>
    </div>
  );
};

export default Search;
