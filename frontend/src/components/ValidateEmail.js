    import * as Yup from "yup";

    // ✅ Validation for Forgot Password – Email Only
    export const ValidateEmailOnly = Yup.object({
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    });
