const ProvinceList = ({ dataAPIAddress }) => {
  return dataAPIAddress.province.map((item, index) => (
    <option value={item.name} key={index}>
      {item.name}
    </option>
  ));
};

const DistrictList = ({ dataAPIAddress }) => {
  return dataAPIAddress.districts.map((item, index) => (
    <option value={item.name} key={index}>
      {item.name}
    </option>
  ));
};

const CommuneList = ({ dataAPIAddress }) => {
  return dataAPIAddress.commune.map((item, index) => (
    <option value={item.name} key={index}>
      {item.name}
    </option>
  ));
};

export { ProvinceList, DistrictList, CommuneList };
