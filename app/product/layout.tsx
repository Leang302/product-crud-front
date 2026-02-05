import { ProfileBar } from "./_components/ProfileBar";

export default function layout({children}:{children: React.ReactNode}) {
  return (
    <div className="mx-auto w-[80%]">
        <ProfileBar/>
        {children}</div>
  )
}
