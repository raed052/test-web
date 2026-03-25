import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Search, Crown, UserX } from 'lucide-react'

async function getUsers(search?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data } = await query
  return data || []
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams
  const users = await getUsers(search)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            User Management
          </h1>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search by name or email..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Usage Today</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-sm font-medium">
                            {(user.full_name || 'U')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {user.full_name || 'Unknown'}
                          {user.is_admin && <Crown className="h-4 w-4 text-yellow-500" />}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.subscription_tier === 'free' ? 'secondary' : 'default'}>
                      {user.subscription_tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.daily_usage || 0} / {user.daily_limit || 2} files
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="ghost" size="sm">
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
