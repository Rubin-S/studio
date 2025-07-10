
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck } from "lucide-react";
import { getAllUsers } from "./actions";
import RoleManagementClient from "./RoleManagementClient";

export const dynamic = 'force-dynamic';

export default async function RolesPage() {
    const { users, error } = await getAllUsers();
    
    if (error) {
        return (
            <div className="space-y-6">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This feature requires special permissions. Please ensure your Firebase Admin SDK is configured correctly.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-8 w-8" />
                <div>
                    <h1 className="text-3xl font-bold font-headline">Roles & Permissions</h1>
                    <p className="text-muted-foreground">Manage user roles and access levels.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        A list of all users from Firebase Authentication.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RoleManagementClient users={users} />
                </CardContent>
            </Card>
        </div>
    );
}
