// https://tailwindcomponents.com/component/hoverable-table
import React from "react";
export const revalidate = 0;

import { getUsers } from "@/actions";
import { Title } from "@/components";

import { redirect } from "next/navigation";
import { UsersTable } from "./ui/UsersTable";

export default async function OrderListPage() {
  const { ok, users = [] } = await getUsers();

  if (!ok) {
    redirect("/");
  }

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <UsersTable users={users} />
    </>
  );
}
