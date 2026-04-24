import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginUserFormData, loginUserSchema } from "./schema/userSchema";
import LoginUserFields from "./Fields/LoginUserFields";
import { useNavigate } from "react-router";

export default function LoginUser() {
  const { users } = useUsers();
  const { login } = useSession();
  const navigate = useNavigate();
  const { control, handleSubmit, setError } = useForm<loginUserFormData>({
    resolver: zodResolver(loginUserSchema),
  });

  function onSubmit(data: loginUserFormData) {
    const user = users.find(
      (u) => u.name.toLowerCase() === data.name.toLocaleLowerCase(),
    );

    if (!user) {
      setError("name", { message: "Usuario no encontrado" });
      return;
    }

    login(user.id);
    navigate("/exercise");
  }

  return (
    <section className="bg-linear-to-bl from-black to-green-900 min-h-dvh grid place-items-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-white bg-gray-950 flex flex-col items-center gap-5 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 animate-slide-up-fade"
      >
        <h2 className="text-2xl font-bold text-white self-center uppercase">
          Iniciar Sesión
        </h2>
        <LoginUserFields control={control} />
        <button
          type="submit"
          className="w-full bg-green-800 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg py-2.5 transition cursor-pointer mt-2"
        >
          Ingresar
        </button>
        <div className="flex flex-row gap-2">
          <span>¿No te has registrado?</span>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-violet-300 underline cursor-pointer"
          >
            Registrate
          </button>
        </div>
      </form>
    </section>
  );
}
