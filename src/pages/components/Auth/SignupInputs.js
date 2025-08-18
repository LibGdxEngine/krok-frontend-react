import {useTranslation} from "react-i18next";

function InputField({title, className = "", value, onChange, inputType = "text"}) {
    return (
        <div className={`w-full flex flex-col items-start justify-center mx-3 mt-3 ${className}`}>
            <div id={`input-field-title`} className={`text-sm text-black`}>{title}</div>
            <input
                type={`${inputType}`}
                placeholder={title}
                value={value}
                onChange={onChange}
                className={`w-full mt-2 p-2 rounded-8 border border-lightDark text-black focus:border-dark outline-none placeholder-black`}
            />
        </div>
    );
}

function SignupInputs({
                          firstName,
                          setFirstName,
                          lastName,
                          setLastName,
                          email,
                          setEmail,
                          password,
                          setPassword,
                          confirmPassword,
                          setConfirmPassword
                      }) {
    const {t, i18n} = useTranslation("common");
    return (
        <div id={`input-fields-container`} className={`w-full flex flex-col justify-start items-center`}>
            <div id={`input-field`} className={`w-full flex flex-row items-start justify-start`}>
                <InputField title={`${t("FirstName")}`} value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                <InputField title={`${t("LastName")}`} value={lastName} onChange={(e) => setLastName(e.target.value)}/>
            </div>
            <InputField title={`${t("Email")}`} className={`!px-3`} value={email} onChange={(e) => setEmail(e.target.value)}/>
            <InputField inputType={'password'} title={`${t("Password")}`} className={`!px-3`} value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
            <InputField inputType={'password'} title={`${t("Password")}`} className={`!px-3`} value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
        </div>
    );
}

export default SignupInputs;