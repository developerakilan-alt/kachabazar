import ReactTagInput from "@pathofdev/react-tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import Tree from "rc-tree";
import { Scrollbars } from "react-custom-scrollbars-2";
import { X } from "lucide-react";

//internal import

import Error from "@/components/form/others/Error";
import { notifyError } from "@/utils/toast";
import LabelArea from "@/components/form/selectOption/LabelArea";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import TextAreaCom from "@/components/form/input/TextAreaCom";
import useBulkActionSubmit from "@/hooks/useBulkActionSubmit";
import ParentCategory from "@/components/category/ParentCategory";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useAction } from "@/context/ActionContext";

const BulkActionDrawer = ({ ids, title, data, childId, attributes }) => {
  const { openBulkAction, setOpenBulkAction } = useAction();

  const { showingTranslateValue } = useUtilsFunction();

  const {
    tag,
    setTag,
    published,
    register,
    onSubmit,
    errors,
    checked,
    setChecked,
    resetRefTwo,
    handleSubmit,
    setPublished,
    selectedCategory,
    setSelectedCategory,
    defaultCategory,
    setDefaultCategory,
    selectCategoryName,
    setSelectCategoryName,
    isSubmitting,
  } = useBulkActionSubmit(ids, childId);

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
        title: showingTranslateValue(category?.name),
        key: category._id,
        children:
          category.children.length > 0 && renderCategories(category.children),
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
  };

  const handleSelect = (key) => {
    const checkId = ids?.find((data) => data === key);

    if (ids?.length === data[0]?.children?.length) {
      return notifyError("This can't be select as a parent category!");
    } else if (checkId !== undefined) {
      return notifyError("This can't be select as a parent category!");
    } else if (key === childId) {
      return notifyError("This can't be select as a parent category!");
    } else {
      if (key === undefined) return;
      setChecked(key);

      const obj = data[0];
      const result = findObject(obj, key);
      setSelectCategoryName(showingTranslateValue(result?.name));
    }
  };

  const STYLE = `
  .rc-tree-child-tree {
    display: hidden;
  }
  .node-motion {
    transition: all .3s;
    overflow-y: hidden;
  }
`;

  if (!openBulkAction) return null;

  return (
    <Sheet open={openBulkAction} onOpenChange={setOpenBulkAction}>
      <SheetContent
        className="flex flex-col overflow-hidden p-0"
        showClose={false}
      >
        <SheetHeader className="border-b p-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-1 flex-col text-left">
              <SheetTitle className="text-xl">
                {`Update Selected ${title}`}
              </SheetTitle>
              <SheetDescription>
                {`Apply changes to the selected ${title} from the list`}
              </SheetDescription>
            </div>
            <div className="ml-4 flex items-center gap-3">
              <SheetClose asChild>
                <button
                  aria-label="Close"
                  className="rounded-sm p-1.5 bg-red-100 text-red-600 opacity-80 transition-opacity hover:opacity-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-ring dark:bg-red-900/50  dark:hover:bg-red-900/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>

        <Scrollbars className="flex-1">
          <form
            id="bulk-action-form"
            onSubmit={handleSubmit(onSubmit)}
            className="block"
          >
            <div className="px-6 pt-8 pb-6 mb-8 flex-grow w-full h-full max-h-full">
              {title === "Products" && (
                <>
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Categorys" />
                    <div className="col-span-8 sm:col-span-4">
                      <ParentCategory
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        setDefaultCategory={setDefaultCategory}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Default Category" />
                    <div className="col-span-8 sm:col-span-4">
                      <Select
                        value={defaultCategory?.[0]?._id || ""}
                        onValueChange={(val) => {
                          const found = selectedCategory?.find(
                            (c) => c._id === val,
                          );
                          if (found) setDefaultCategory([found]);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Default Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory?.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {showingTranslateValue(cat.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Published" />
                    <div className="col-span-8 sm:col-span-4">
                      <SwitchToggle
                        handleProcess={setPublished}
                        processOption={published}
                      />
                      <Error errorName={errors.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Product Tags" />
                    <div className="col-span-8 sm:col-span-4">
                      <ReactTagInput
                        placeholder="Product Tag (Write then press enter to add new tag )"
                        tags={tag}
                        onChange={(newTags) => setTag(newTags)}
                      />
                    </div>
                  </div>
                </>
              )}

              {title === "Coupons" && (
                <>
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Start Time" />
                    <div className="col-span-8 sm:col-span-4">
                      <Input
                        {...register(`startTime`, {
                          required: "Coupon Validation Start Time",
                        })}
                        label="Coupon Validation Start Time"
                        name="startTime"
                        type="datetime-local"
                        placeholder="Start Time"
                      />

                      <Error errorName={errors.startTime} />
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="End Time" />
                    <div className="col-span-8 sm:col-span-4">
                      <Input
                        {...register(`endTime`, {
                          required: "Coupon Validation End Time",
                        })}
                        label="Coupon Validation End Time"
                        name="endTime"
                        type="datetime-local"
                        placeholder="End Time"
                      />

                      <Error errorName={errors.endTime} />
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Published" />
                    <div className="col-span-8 sm:col-span-4">
                      <SwitchToggle
                        handleProcess={setPublished}
                        processOption={published}
                      />
                      <Error errorName={errors.published} />
                    </div>
                  </div>
                </>
              )}

              {title === "Languages" && (
                <>
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Published" />
                    <div className="col-span-8 sm:col-span-4">
                      <SwitchToggle
                        title={""}
                        processOption={published}
                        handleProcess={setPublished}
                      />
                    </div>
                  </div>
                </>
              )}

              {title === "Currencies" && (
                <>
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Enabled" />
                    <div className="col-span-8 sm:col-span-4">
                      <SwitchToggle
                        title={""}
                        processOption={published}
                        handleProcess={setPublished}
                      />
                    </div>
                  </div>
                </>
              )}

              {title === "Categories" && (
                <>
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Description" />
                    <div className="col-span-8 sm:col-span-4">
                      <TextAreaCom
                        register={register}
                        label="Description"
                        name="description"
                        type="text"
                        placeholder="Category Description"
                      />
                      <Error errorName={errors.description} />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Parent Category" />
                    <div className="col-span-8 sm:col-span-4">
                      <Input
                        readOnly
                        {...register(`parent`, {
                          required: false,
                        })}
                        name="parent"
                        value={selectCategoryName ? selectCategoryName : "Home"}
                        placeholder="parent category"
                        type="text"
                      />

                      <div className="draggable-demo capitalize">
                        <style dangerouslySetInnerHTML={{ __html: STYLE }} />
                        <Tree
                          treeData={renderCategories(data)}
                          selectedKeys={[checked]}
                          onSelect={(v) => handleSelect(v[0])}
                          motion={motion}
                          animation="slide-up"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Published" />
                    <div className="col-span-8 sm:col-span-4">
                      <SwitchToggle
                        title={""}
                        processOption={published}
                        handleProcess={setPublished}
                      />
                    </div>
                  </div>
                </>
              )}

              {title === "Child Categories" && (
                <>
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Description" />
                    <div className="col-span-8 sm:col-span-4">
                      <TextAreaCom
                        register={register}
                        label="Description"
                        name="description"
                        type="text"
                        placeholder="Category Description"
                      />
                      <Error errorName={errors.description} />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Parent Category" />
                    <div className="col-span-8 sm:col-span-4">
                      <Input
                        readOnly
                        {...register(`parent`, {
                          required: false,
                        })}
                        name="parent"
                        value={selectCategoryName ? selectCategoryName : "Home"}
                        placeholder="parent category"
                        type="text"
                      />

                      <div className="draggable-demo capitalize">
                        <style dangerouslySetInnerHTML={{ __html: STYLE }} />
                        <Tree
                          treeData={renderCategories(data)}
                          selectedKeys={[checked]}
                          onSelect={(v) => handleSelect(v[0])}
                          motion={motion}
                          animation="slide-up"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Published" />
                    <div className="col-span-8 sm:col-span-4">
                      <SwitchToggle
                        title={""}
                        processOption={published}
                        handleProcess={setPublished}
                      />
                    </div>
                  </div>
                </>
              )}

              {title === "Attributes" && (
                <>
                  {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <LabelArea label="Options" />
                      <div className="col-span-8 sm:col-span-4">
                        <Select
                          name="option"
                          {...register(`option`, {
                            required: `Option is required!`,
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dropdown">Dropdown</SelectItem>
                            <SelectItem value="Radio">Radio</SelectItem>
                          </SelectContent>
                        </Select>
                        <Error errorName={errors.option} />
                      </div>
                    </div> */}

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Published" />
                    <div className="col-span-8 sm:col-span-4">
                      <SwitchToggle
                        title={""}
                        processOption={published}
                        handleProcess={setPublished}
                      />
                    </div>
                  </div>
                </>
              )}

              {title === "Attribute Value(s)" && (
                <>
                  {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <LabelArea label="Change Attribute Group" />
                      <div className="col-span-8 sm:col-span-4">
                        <Select
                          name="groupName"
                          {...register(`groupName`, {
                            required: false,
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Attribute Group" />
                          </SelectTrigger>
                          <SelectContent>
                            {attributes?.map((value, index) => (
                              <SelectItem key={index + 1} value={value._id}>
                                {showingTranslateValue(value?.name)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Error errorName={errors.groupName} />
                      </div>
                    </div> */}

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Published" />
                    <div className="col-span-8 sm:col-span-4">
                      <SwitchToggle
                        title={""}
                        processOption={published}
                        handleProcess={setPublished}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </Scrollbars>

        <div className="w-full py-4 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-background border-t">
          <div className="grow-0 md:grow lg:grow xl:grow">
            <Button
              onClick={() => setOpenBulkAction(false)}
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
          <div className="grow-0 md:grow lg:grow xl:grow">
            <Button
              type="submit"
              form="bulk-action-form"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Updating...
                </>
              ) : (
                `Bulk Update ${title}`
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BulkActionDrawer;
