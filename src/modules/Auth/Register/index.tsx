import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useRegisterMutation } from "@/services/authService";
import { useToast } from "@/utils/hooks";

import { LoadingButton } from "@mui/lab";
import * as yup from "yup";
import { FormattedMessage } from "react-intl";
import AuthLayout from "@/layouts/AuthLayout";
import Link from "next/link";
import Head from "next/head";

const schema = yup.object().shape({
  username: yup
    .string()
    .trim("Username no space")
    .matches(/[a-zA-Z]/, "Username can only contain letters.")
    .required("Username is required"),
  firstName: yup
    .string()
    .matches(/[a-zA-Z]/, "First name can only contain letters.")
    .required("First name is required"),
  lastName: yup
    .string()
    .matches(/[a-zA-Z]/, "Last name can only contain letters.")
    .required("First name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("First name is required"),
  password: yup
    .string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password contains characters, numbers and at least one special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password is required"),
});

const FormRegister = (): JSX.Element => {
  const [onRegister, { isLoading }] = useRegisterMutation();
  const { notify, message } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const response = await onRegister({ ...values, type: "player" }).unwrap();
      if (response && response?.message === "CREATED") {
        reset();
        notify({ message: "Registered Successfully" });
        router.push("/login");
      }
    } catch (error: any) {
      if (error.data.message === "DUPLICATE") {
        return notify({
          message: "Duplicated username or email",
          type: "error",
        });
      }
      return notify({ message: message.ERROR, type: "error" });
    }
  };
  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <AuthLayout>
        <Typography
          component="h1"
          variant="h5"
          fontWeight={600}
          className="flex justify-center"
          color="color.text"
        >
          Sign Up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          <TextField
            required
            fullWidth
            label="First name"
            autoFocus
            sx={{ my: 1 }}
            error={!!errors["firstName"]}
            helperText={errors["firstName"] ? errors["firstName"].message : ""}
            {...register("firstName")}
            onBlur={(e) => setValue("firstName", e.target.value.trim())}
          />
          <TextField
            required
            fullWidth
            label="Last name"
            sx={{ my: 1 }}
            error={!!errors["lastName"]}
            helperText={errors["lastName"] ? errors["lastName"].message : ""}
            {...register("lastName")}
            onBlur={(e) => setValue("lastName", e.target.value.trim())}
          />
          <TextField
            required
            fullWidth
            label="Email"
            type="email"
            sx={{ my: 1 }}
            error={!!errors["email"]}
            helperText={errors["email"] ? errors["email"].message : ""}
            {...register("email")}
            onBlur={(e) => setValue("email", e.target.value.trim())}
          />
          <TextField
            required
            fullWidth
            label={<FormattedMessage id="label.username" />}
            sx={{ my: 1 }}
            error={!!errors["username"]}
            helperText={errors["username"] ? errors["username"].message : ""}
            {...register("username")}
            onBlur={(e) => setValue("username", e.target.value.trim())}
          />
          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            sx={{ my: 1 }}
            error={!!errors["password"]}
            helperText={errors["password"] ? errors["password"].message : ""}
            {...register("password")}
            onBlur={(e) => setValue("password", e.target.value.trim())}
          />
          <TextField
            required
            fullWidth
            label="Confirm Password"
            type="password"
            sx={{ my: 1 }}
            error={!!errors["confirmPassword"]}
            helperText={
              errors["confirmPassword"] ? errors["confirmPassword"].message : ""
            }
            {...register("confirmPassword")}
            onBlur={(e) => setValue("confirmPassword", e.target.value.trim())}
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, fontWeight: 600 }}
            loading={isLoading}
          >
            Sign Up
          </LoadingButton>
          <Grid container>
            <Box
              display="flex"
              justifyContent="end"
              width="100%"
              sx={{
                "&:hover": {
                  opacity: "0.8",
                },
              }}
            >
              <Link
                href="/login"
                className="w-full flex justify-end items-center gap-1"
              >
                <Typography color="color.text">
                  Already have an account?{" "}
                </Typography>
                <Typography
                  className="whitespace-nowrap text-right"
                  color="color.text"
                >
                  Sign In
                </Typography>
              </Link>
            </Box>
          </Grid>
        </Box>
      </AuthLayout>
    </>
  );
};

export default FormRegister;
