import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

export function SignupForm({
  className,
  credentials,
  setCredentials,
  handleSubmit,
  ...props
}) {
  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Register an account to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}/>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required  value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}/>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password_confirmation">Confirm Password</Label>
                </div>
                <Input id="password_confirmation" type="password" required  value={credentials.password_confirmation}
          onChange={(e) => setCredentials({ ...credentials, password_confirmation: e.target.value })}/>
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to='/login' className="underline underline-offset-4">
                Login
              </Link> {" "}
              to your account
            </div>
          </form>
        </CardContent>
      </Card>
    </div>)
  );
}
