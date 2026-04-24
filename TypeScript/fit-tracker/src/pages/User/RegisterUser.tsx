import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { useForm } from "react-hook-form";
import { registerUserFormData, registerUserSchema } from "./schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "../../types/interfaces";
import RegisterUserFields from "./Fields/RegisterUserFields";
import { useNavigate } from "react-router";

export default function RegisterUser() {
  const { addUser } = useUsers();
  const { login } = useSession();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<registerUserFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  function onSubmit(data: registerUserFormData) {
    console.log("Haciendo algo....");
    const newUser: User = {
      id: Date.now(),
      ...data,
      membership: {
        id: Date.now() + 1,
        ...data.membership,
        status: "✅ Activo",
        start_date: new Date(),
      },
      routine: { id: Date.now() + 2, routineName: "", entries: [] },
    };

    addUser(newUser);
    login(newUser.id);
    navigate("/exercise");
  }

  return (
    <section className="bg-linear-to-bl from-black to-green-900 min-h-dvh grid place-items-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-white bg-gray-950 flex flex-col items-center gap-5 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 animate-slide-up-fade"
      >
        <h2 className="text-2xl font-bold text-white self-center uppercase">
          Registro
        </h2>
        <RegisterUserFields control={control} />
        <button
          type="submit"
          className="w-full bg-green-800 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg py-2.5 transition cursor-pointer mt-2"
        >
          Registrarse
        </button>
        <div className="flex flex-row gap-2">
          <span>¿Ya tienes una cuenta?</span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-violet-300 underline cursor-pointer"
          >
            Ingresa a tu cuenta
          </button>
        </div>
      </form>
    </section>
  );
}
