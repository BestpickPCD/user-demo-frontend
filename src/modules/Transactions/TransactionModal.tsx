import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import { Select, TextField } from "../../components/MUIComponents";
import Modals from "../../components/Modals";
import { useCreateTransactionMutation } from "../../services/gamesService";
import { useToast } from "../../utils/hooks";
import { useDispatch } from "react-redux";
import { isSubmitTransaction } from "@/app/slices/commonSlices";

const transactionTypes = ["deposit", "withdraw"];

export interface Transactions {
  id: number;
  amount: string | number;
  userId: string;
  username?: string | null;
  agentUsername?: string | null;
  senderUser?: string;
  receiverUser?: string;
  type: "win" | "bet" | "cancel" | "deposit" | "withdraw" | "user.add_balance";
  currencyId: number;
  status: string;
  updatedAt: string;
  note?: string;
  token: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  actionType?: string;
}

export const transactionStatus = ["success", "pending", "cancelled", "failed"];

const typeOptions = transactionTypes.map((item) => ({
  id: item,
  value: item,
  name: `${item.slice(0, 1).toUpperCase()}${item.slice(1)}`,
}));

const schema = yup.object().shape({
  userId: yup.string().required("Users is required!"),
  amount: yup
    .number()
    .moreThan(0, "Amount must be greater than 0")
    .typeError("Amount must be a number")
    .required("Amount is required!"),
  type: yup.string(),
});

type CreateTransactionBody = {
  userId: string;
  type?: string;
  amount: number;
};

const TransactionModal = ({
  actionType,
  open,
  onClose,
  refetch,
}: ModalProps): JSX.Element => {
  const { notify, message } = useToast();
  const dispatch = useDispatch();

  const user = localStorage.getItem("user") || "";
  let parseUser;
  if (user) {
    parseUser = JSON.parse(user || "");
  }

  const {
    register,
    reset,
    handleSubmit,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userId: parseUser?.id || "",
      amount: 0,
      type: actionType || "",
    },
  });

  const [createTransaction] = useCreateTransactionMutation();

  const onSubmit = async (values: CreateTransactionBody) => {
    try {
      const response = await createTransaction({
        ...values,
        type: actionType || values.type,
      }).unwrap();
      if (response) {
        notify({
          message: message.CREATED,
        });
        reset();
        onClose();
        refetch();
        dispatch(isSubmitTransaction(true));
      }
    } catch (error: any) {
      notify({
        message: error.data.message,
        type: "error",
      });
    }
  };

  const handleClose = () => {
    onClose();
    clearErrors();
  };

  return (
    <Modals
      modalTitle={`${
        actionType === "deposit"
          ? "Deposit"
          : actionType === "withdraw"
          ? "Withdraw"
          : ""
      }`}
      onClose={handleClose}
      open={open}
      onOk={handleSubmit(onSubmit)}
      fullWidth
    >
      <Box component={"form"} id="form-transaction" paddingX={3} paddingY={4}>
        <div className="block">
          <Box display={"flex"} gap="1rem" sx={{ my: 2 }}>
            <TextField
              name="amount"
              label="Amount"
              errors={errors}
              register={register}
              type="number"
            />
          </Box>
          {!actionType && (
            <Box display={"flex"} gap="1rem" sx={{ my: 2 }}>
              <Select
                name="type"
                label={<FormattedMessage id="label.type" />}
                control={control}
                options={typeOptions}
                errors={errors}
              />
            </Box>
          )}
        </div>
      </Box>
    </Modals>
  );
};

export default memo(TransactionModal);
