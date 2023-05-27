import React from 'react';
import { Divider } from '@mui/material';
import ProductsTable from '../components/ProductsTable';

export default function ProductsPage() {
  // Brand
  const brandPostApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/PostBrand?item_brand=`;
  const brandGetApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/GetBrand`;
  const brandDeleteApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/DeleteItemBrand/`;
  const brandUpdateApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/updateItemBrand?OldBrandName=`;
  const brandColumnName = 'brand';

  // Category
  const categoryGetApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/GetCategory`;
  const categoryPostApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/PostCategory?itemCategory=`;
  const categoryDeleteApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/DeleteItemCategory/`;
  const categoryUpdateApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/updateItemCategory?OldCategoryName=`;
  const categoryColumnName = 'category';

  // Size
  const sizeGetApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/GetItem_size`;
  const sizePostApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/PostItem_size?item_size=`;
  const sizeDeleteApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/DeleteItemSize/`;
  const sizeUpdateApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/updateItemSize?OldSizeName=`;

  const sizeColumnName = 'size';

  // Type
  // need to post with image
  const typeGetApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/GetItem_type`;
  const typePostApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/PostItem_type?Item_type_name=s&Item_type_image=dd`;
  const typeDeleteApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/DeleteItemType/`;
  const typeUpdateApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/updateItemType?OldTypeName=`;
  const typeColumnName = 'type';

  // Color
  // need to post with palett
  const colorGetApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/GetColor`;
  const colorPostApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/PostColor?item_color=g&color=r`;
  const colorDeleteApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/DeleteItemColor/`;
  const colorUpdateApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/updateItemColor?OldColorName=`;
  const colorColumnName = 'color';

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          <ProductsTable
            getApi={brandGetApi}
            postApi={brandPostApi}
            deleteApi={brandDeleteApi}
            updateApi={brandUpdateApi}
            columnName={brandColumnName}
          />
        </div>
        <div>
          <ProductsTable
            getApi={categoryGetApi}
            postApi={categoryPostApi}
            deleteApi={categoryDeleteApi}
            updateApi={categoryUpdateApi}
            columnName={categoryColumnName}
          />
        </div>
      </div>
      <Divider sx={{ my: 10, border: 1, borderBlockColor: 'lightgreen' }}>
        {/* 
               
            */}
      </Divider>
      <div style={{ display: 'flex' }}>
        <div>
          <ProductsTable
            getApi={sizeGetApi}
            postApi={sizePostApi}
            deleteApi={sizeDeleteApi}
            updateApi={sizeUpdateApi}
            columnName={sizeColumnName}
          />
        </div>
        <div>
          <ProductsTable
            getApi={typeGetApi}
            postApi={typePostApi}
            deleteApi={typeDeleteApi}
            updateApi={typeUpdateApi}
            columnName={typeColumnName}
          />
        </div>
      </div>
      <Divider sx={{ my: 10, border: 1, borderBlockColor: 'lightgreen' }}>
        {/* 
               
            */}
      </Divider>
      <div style={{ display: 'flex' }}>
        <div>
          <ProductsTable
            getApi={colorGetApi}
            postApi={colorPostApi}
            deleteApi={colorDeleteApi}
            updateApi={colorUpdateApi}
            columnName={colorColumnName}
          />
        </div>
      </div>
    </div>
  );
}
