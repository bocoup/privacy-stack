import { Outlet } from "@remix-run/react";
export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <Outlet />
        </div>
      </div>
      <div className="hidden bg-muted lg:h-screen lg:flex lg:flex-col justify-center">
        <img
          src="/privacy.svg"
          alt="A mobile phone in a circle with a lock on the circle."
          className="mt-auto w-full max-w-52 mx-auto object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <p className="p-4 mt-auto text-center text-xs">
          Lock graphic created by{" "}
          <a
            target="blank"
            className="underline"
            href="https://thenounproject.com/icon/privacy-4327730/"
          >
            Kamin Ginkaew from the Noun Project
          </a>
          .
        </p>
      </div>
    </div>
  );
}
