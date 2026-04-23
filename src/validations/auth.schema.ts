
import { z} from "zod";

export const loginSchema = z.object({
  phone: z
    .string({ message: "Phone field is required" })
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"), 
  password: z.string({message:"Password is required"}).min(6,"Minimum length is 6 charecters").max(60, "Miximum charecter length 60 charecters"),
});

export type TLoginInputs = z.infer<typeof loginSchema>;


export const registerSchema = z.object({
  name: z.string({message:"Name is required"}).min(1, "Name is required").max(60,"Maximum length is 60 charecters"),
   phone: z
    .string({ message: "Phone field is required" })
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"), 
  password: z.string({message:"Password is required"}).min(6,"Minimum length is 6 charecters").max(60, "Miximum charecter length 60 charecters"),
})

export type TRegisterInputs = z.infer<typeof registerSchema>