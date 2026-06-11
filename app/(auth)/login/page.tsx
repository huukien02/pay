import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/core"
import { OAuthButtons } from "@/features/auth/components/oauth-buttons"

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>
          Đăng nhập để quản lý tài chính cá nhân của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OAuthButtons />
      </CardContent>
    </Card>
  )
}
