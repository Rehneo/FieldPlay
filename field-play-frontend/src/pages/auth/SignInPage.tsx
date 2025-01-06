import * as Yup from "yup";
import {useAuth} from "../../context/UserAuth.tsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Link} from "react-router-dom";

type SignInFormInputs = {
    username: string;
    password: string;
}

const validation = Yup.object().shape({
    username: Yup.string().required("Введите логин")
        .min(4, "Логин должен содержать от 4 до 128 символов")
        .max(128, "Логин должен содержать от 4 до 128 символов"),
    password: Yup.string().required("Введите пароль")
        .min(6, "Пароль должен содержать от 6 до 128 символов")
        .max(128, "Пароль должен содержать от 6 до 128 символов"),
})

const SignInPage = () => {
    const {signIn, authErrorMessage} = useAuth();
    const {register, handleSubmit, formState: {errors}} = useForm<SignInFormInputs>({
        resolver: yupResolver(validation),
    });

    const handleSignIn = (form: SignInFormInputs) => {
        signIn({username: form.username, password: form.password});
    };

    return (

        <div className="container mx-auto p-4 bg-white">
            <div className="w-full md:w-1/2 lg:w-1/3 mx-auto my-12">
                <h1 className="text-lg font-bold">Войти</h1>
                <form className="flex flex-col mt-4" onSubmit={handleSubmit(handleSignIn)}>
                    <input
                        type="username"
                        className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                        placeholder="Username"
                        {...register("username")}
                    />
                    {errors.username ? <p className="text-red-600">{errors.username.message}</p> : ""}
                    <input
                        type="password"
                        className="px-4 py-3 mt-4 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                        placeholder="Password"
                        {...register("password")}
                    />
                    {errors.password ? <p className="text-red-600">{errors.password.message}</p> : ""}
                    <button
                        type="submit"
                        className="mt-4 px-4 py-3  leading-6 text-base rounded-md border border-transparent text-white focus:outline-none bg-green-500 hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer inline-flex items-center w-full justify-center font-medium"
                    >
                        Войти
                    </button>
                    {authErrorMessage ?
                        <p className="mt-4 px-4 py-3  flex justify-center text-red-600">{authErrorMessage}</p> : ""}
                    <div className="flex flex-col items-center mt-5">
                        <p className="mt-1 text-xs font-light text-gray-500">
                            Нет аккаунта?
                            <Link to={"/sign-up"}
                                  className="ml-1 font-medium text-green-400"> Регистрация
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default SignInPage;