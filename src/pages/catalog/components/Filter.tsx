import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import 'antd/dist/antd.css';
import { Select } from 'antd';
import { CatalogContext } from '../../../state/CatalogueState';

const { Option } = Select;

const FilterCatalog: FunctionComponent<{}> = () => {
  const { catalog, setCatalog } = useContext(CatalogContext);
  const [brands, setBrands] = useState<any>([]);

  useEffect(() => {
    const componentdidmount = async () => {
      const brandLocalStorage = localStorage.getItem('user');
      if (brandLocalStorage !== null) {
        const brandLocalStorageJson = JSON.parse(brandLocalStorage);
        const brandsConverted = brandLocalStorageJson.brand.split(',');

        setBrands(brandsConverted);
      }
    };
    componentdidmount();
  }, []);

  const setBrandContextCatalog = (marca: any) => {
    setCatalog((prevState: any) => ({
      ...prevState,
      brand: { marca },
    }));
  };

  return (
    <div className="flex items-center">
      <div className="regular">Filtros</div>
      {/*  {isAlert && (
        <Alert
          message="Seleccione una marca para listar los modelos."
          type="warning"
          className="mt-5 mb-5"
          style={{ width: 600 }}
        />
      )} */}
      <div className="ml-2">
        {/* <Select
          defaultValue={
            catalog.brand.marca ? catalog.brand.marca : 'Seleccione una marca'
          }
          style={{ width: 200 }}
          onChange={setBrandContextCatalog}
        >
          {brands.map((data: any, index: any) => (
            <Option key={index} value={data}>
              {data}
            </Option>
          ))}
        </Select> */}
      </div>
    </div>
  );
};
export default FilterCatalog;
