import Select from "react-select";
import Tree from "rc-tree";

//internal import
import useAsync from "@/hooks/useAsync";
import { notifySuccess } from "@/utils/toast";
import CategoryServices from "@/services/CategoryServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useTheme } from "@/context/ThemeContext";

const ParentCategory = ({
  selectedCategory,
  setSelectedCategory,
  setDefaultCategory,
}) => {
  const { data, loading } = useAsync(CategoryServices?.getAllCategory);
  const { showingTranslateValue } = useUtilsFunction();
  const { theme } = useTheme();

  const STYLE = `
  .rc-tree-child-tree {
    display: block;
  }
  .node-motion {
    transition: all .3s;
    overflow-y: hidden;
  }
`;

  const motion = {
    motionName: "node-motion",
    motionAppear: false,
    onAppearStart: (node) => {
      return { height: 0 };
    },
    onAppearActive: (node) => ({ height: node.scrollHeight }),
    onLeaveStart: (node) => ({ height: node.offsetHeight }),
    onLeaveActive: () => ({ height: 0 }),
  };

  const renderCategories = (categories) => {
    let myCategories = [];
    for (let category of categories) {
      myCategories.push({
        title: showingTranslateValue(category.name),
        key: category._id,
        children:
          category?.children?.length > 0 && renderCategories(category.children),
      });
    }

    return myCategories;
  };

  const findObject = (obj, target) => {
    return obj._id === target
      ? obj
      : obj?.children?.reduce(
          (acc, obj) => acc ?? findObject(obj, target),
          undefined,
        );
    // if (obj._id === target) return obj;

    // for (let c of obj.children) {
    //   let x = findObject(target, c);
    //   console.log('c', c);
    //   if (x) return x;
    // }
  };

  const handleSelect = (key) => {
    // Search across ALL root categories, not just data[0]
    let result;
    for (const root of data) {
      result = findObject(root, key);
      if (result !== undefined) break;
    }

    if (result !== undefined) {
      const getCategory = selectedCategory.filter(
        (value) => value._id === result._id,
      );

      if (getCategory.length !== 0) {
        return notifySuccess("This category already selected!");
      }

      setSelectedCategory((pre) => [
        ...pre,
        {
          _id: result?._id,
          name: result?.name,
        },
      ]);
      setDefaultCategory(() => [
        {
          _id: result?._id,
          name: result?.name,
        },
      ]);
    }
  };

  const handleRemove = (v) => {
    setSelectedCategory(v || []);
  };

  return (
    <>
      <div className="mb-2">
        <Select
          isMulti
          value={selectedCategory?.map((cat) => ({
            value: cat._id,
            label: showingTranslateValue(cat.name),
            ...cat,
          }))}
          onChange={(selectedOptions) => {
            const categories =
              selectedOptions?.map((opt) => ({
                _id: opt._id,
                name: opt.name,
              })) || [];
            handleRemove(categories);
          }}
          placeholder="Select Category"
          className="react-select-container"
          classNamePrefix="react-select"
          theme={(selectTheme) => ({
            ...selectTheme,
            colors: {
              ...selectTheme.colors,
              primary: theme === "dark" ? "#374151" : "#3b82f6",
              primary25: theme === "dark" ? "#1f2937" : "#dbeafe",
              neutral0: theme === "dark" ? "#1f2937" : "#ffffff",
              neutral80: theme === "dark" ? "#e5e7eb" : "#1f2937",
            },
          })}
        />
      </div>

      {!loading && data !== undefined && (
        <div className="draggable-demo capitalize">
          <style dangerouslySetInnerHTML={{ __html: STYLE }} />
          <Tree
            expandAction="click"
            treeData={renderCategories(data)}
            // defaultCheckedKeys={id}
            onSelect={(v) => handleSelect(v[0])}
            motion={motion}
            animation="slide-up"
          />
        </div>
      )}
    </>
  );
};

export default ParentCategory;
