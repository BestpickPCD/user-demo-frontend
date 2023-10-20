import AuthLayout from "@/layouts/AuthLayout";
import { useLoginMutation } from "@/services/authService";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup
    .string()
    .trim("Username no space")
    .matches(/[a-zA-Z]/, "Username can only contain letters.")
    .required("Username is required"),
  password: yup
    .string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password contains characters, numbers and at least one special character"
    )
    .required("Password is required"),
});
export default function Home() {
  const [onLogin, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: { username: string; password: string }) => {
    try {
      const response = await onLogin(values).unwrap();
      if (response.message === "SUCCESS") {
        reset();
        router.push("/games");
        const { tokens, id, email, name, username, type } = response.data;
        localStorage.setItem(
          "tokens",
          JSON.stringify({
            token: tokens,
          })
        );
        localStorage.setItem(
          "user",
          JSON.stringify({ id, email, name, username, type })
        );
      }
    } catch (error: any) {
      if ((error.data.message as any) === "NOT_FOUND") {
        console.log("error");
      }
      console.log("error");
    }
  };

  return (
    <>
      <Head>
        <title>
          <FormattedMessage id="label.sign.in" />
        </title>
      </Head>
      <AuthLayout>
        <Typography
          component="h1"
          variant="h5"
          fontWeight={600}
          className="flex justify-center"
          color="color.text"
        >
          <FormattedMessage id="label.sign.in" />
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label={<FormattedMessage id="label.username" />}
            autoFocus
            sx={{ my: 2, color: "red" }}
            error={!!errors["username"]}
            helperText={errors["username"] ? errors["username"].message : ""}
            {...register("username")}
          />
          <TextField
            required
            fullWidth
            label={<FormattedMessage id="label.password" />}
            type="password"
            error={!!errors["password"]}
            helperText={errors["password"] ? errors["password"].message : ""}
            {...register("password")}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label={
              <Typography color="color.text">
                <FormattedMessage id="label.remember.me" />
              </Typography>
            }
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, fontWeight: 600 }}
            loading={isLoading}
          >
            <FormattedMessage id="label.sign.in" />
          </LoadingButton>
          <Grid container>
            <Grid
              item
              xs
              sx={{
                "&:hover": {
                  opacity: "0.8",
                },
              }}
            >
              <Link href="/">
                <Typography
                  color="color.text"
                  whiteSpace="nowrap"
                  fontSize="14px"
                >
                  <FormattedMessage id="label.forget.password" />
                </Typography>
              </Link>
            </Grid>
            <Grid
              item
              xs
              sx={{
                "&:hover": {
                  opacity: "0.8",
                },
              }}
            >
              <Link
                href="/register"
                className="w-full flex justify-end gap-1 flex-wrap"
              >
                <Typography
                  color="color.text"
                  whiteSpace="nowrap"
                  fontSize="14px"
                >
                  <FormattedMessage id="label.dont.account" />
                </Typography>
                <Typography
                  className="whitespace-nowrap text-right"
                  color="color.text"
                  fontSize="14px"
                >
                  <FormattedMessage id="label.sign.up" />
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </AuthLayout>
    </>
  );
}
