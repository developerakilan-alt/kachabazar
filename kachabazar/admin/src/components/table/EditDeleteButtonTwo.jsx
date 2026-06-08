import { FiEdit, FiTrash2 } from "react-icons/fi";
//internal import
import Tooltip from "@/components/tooltip/Tooltip";

const EditDeleteButtonTwo = ({
  extra,
  variant,
  handleRemoveVariant,
  attribute,
}) => {
  return (
    <>
      <div className="flex justify-end text-right">
        {!attribute && (
          <div
            // onClick={() => handleEditVariant(variant)}
            className="p-2 cursor-pointer text-muted-foreground hover:text-primary"
          >
            <Tooltip id="edit" Icon={FiEdit} title="Edit" bgColor="#14b8a6" />
          </div>
        )}

        <div
          onClick={() => handleRemoveVariant(variant, extra)}
          className="p-2 cursor-pointer text-muted-foreground hover:text-red-600"
        >
          <Tooltip
            id="delete"
            Icon={FiTrash2}
            title="Delete"
            bgColor="#EF4444"
          />
        </div>
      </div>
    </>
  );
};

export default EditDeleteButtonTwo;
