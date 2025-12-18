 //@ts-nocheck
 // app/api/admin/dashboard/summary/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'; 

// Define a type for recent applications
type RecentApplication = {
  id: string;
  applicantFullName: string | null;
  applicationStatus: string;
  loanApplicationStatus: string | null;
  createdAt: Date;
  applicant: {
    fullName: string | null;
    primaryPhoneNumber: string | null;
  } | null;
  processedBy: {
    fullName: string | null;
  } | null;
};

// FIX: Disable no-unused-vars specifically for the '_' parameter
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: Request) { // Line 24
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      !['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const userRole = session.user.role;

    let totalApplications = 0;
    let totalUsers = 0;
    let totalAdmins = 0;
   let applicationsByStatus: Prisma.ApplicationGroupByOutputType[] | [] = [];
let loanApplicationsByStatus: Prisma.ApplicationGroupByOutputType[] | [] = [];



    // These variables are strongly typed here, which allows us to remove casting later
    let recentApplications: RecentApplication[] = []; 
    let registeredUsersCountByAdmin: number | undefined;
    let userRegistrationsPerMonth: { month: string; count: number }[] = [];
    let applicationsProcessedPerMonth: { month: string; count: number }[] = [];
    let registrationDistribution: { category: string; count: number }[] = [];

    // Utility: Get monthly user registrations
    const getMonthlyRegistrations = async (filterUserId?: string) => {
      const now = new Date();
      const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

      const whereClause: Prisma.UserWhereInput = {
        createdAt: { gte: twelveMonthsAgo },
        role: 'APPLICANT',
      };

      if (filterUserId) {
        whereClause.registeredById = filterUserId;
      }

      const monthlyRegistrationsRaw = await prisma.user.findMany({
        where: whereClause,
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      });

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyDataMap = new Map<string, number>();

      // Initialize 12 months
      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
        const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
        monthlyDataMap.set(monthYear, 0);
      }

      monthlyRegistrationsRaw.forEach(item => {
        const date = new Date(item.createdAt);
        const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
        if (monthlyDataMap.has(monthYear)) {
          monthlyDataMap.set(monthYear, monthlyDataMap.get(monthYear)! + 1);
        }
      });

      return Array.from(monthlyDataMap.entries()).map(([month, count]) => ({ month, count }));
    };

    // Utility: Get monthly processed applications
    const getMonthlyProcessedApplications = async (adminId: string) => {
      const now = new Date();
      const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

      const monthlyApplicationsRaw = await prisma.application.findMany({
        where: {
          createdAt: { gte: twelveMonthsAgo },
          OR: [
            { processedById: adminId },
            { assignedToId: adminId },
          ],
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      });

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyDataMap = new Map<string, number>();

      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
        const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
        monthlyDataMap.set(monthYear, 0);
      }

      monthlyApplicationsRaw.forEach(item => {
        const date = new Date(item.createdAt);
        const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
        if (monthlyDataMap.has(monthYear)) {
          monthlyDataMap.set(monthYear, monthlyDataMap.get(monthYear)! + 1);
        }
      });

      return Array.from(monthlyDataMap.entries()).map(([month, count]) => ({ month, count }));
    };

    // === REGISTRAR_ADMIN Logic ===
    if (userRole === "REGISTRAR_ADMIN") {
      const applicationWhereClause: Prisma.ApplicationWhereInput = {
        OR: [
          { processedById: userId },
          { assignedToId: userId },
        ],
      };

      registeredUsersCountByAdmin = await prisma.user.count({
        where: { registeredById: userId },
      });

      totalUsers = 0; 

      totalApplications = await prisma.application.count({
        where: applicationWhereClause,
      });

      applicationsByStatus = []; 
      loanApplicationsByStatus = [];

      userRegistrationsPerMonth = await getMonthlyRegistrations(userId);
      applicationsProcessedPerMonth = await getMonthlyProcessedApplications(userId);

      // Cast the result to the defined RecentApplication[] type
      recentApplications = await prisma.application.findMany({
        where: applicationWhereClause,
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          applicantFullName: true,
          applicationStatus: true,
          loanApplicationStatus: true,
          createdAt: true,
          applicant: {
            select: { fullName: true, primaryPhoneNumber: true },
          },
          processedBy: {
            select: { fullName: true },
          },
        },
      }) as RecentApplication[];
    }

    // === MAIN_ADMIN Logic ===
    else if (userRole === "MAIN_ADMIN") {
      totalApplications = await prisma.application.count();
      totalUsers = await prisma.user.count({ where: { role: 'APPLICANT' } });
      totalAdmins = await prisma.admin.count();

      // @ts-ignore
const applicationsByStatus = await prisma.application.groupBy({
  by: ['applicationStatus'],
  _count: { id: true },
  orderBy: [{ _count: { id: 'desc' } }],
});

// @ts-ignore
const loanApplicationsByStatus = await prisma.application.groupBy({
  by: ['loanApplicationStatus'],
  _count: { id: true },
  orderBy: [{ _count: { id: 'desc' } }],
});


      // Aggregation for association counts (kept the correct array syntax)
      const associationCounts = await prisma.user.groupBy({
        by: ['associationName'],
        _count: { id: true },
        where: {
          role: 'APPLICANT',
          associationName: { not: null },
        },
        orderBy: [{ _count: { id: 'desc' } }], 
      });

      // Cast the result to the defined RecentApplication[] type
      recentApplications = await prisma.application.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          applicantFullName: true,
          applicationStatus: true,
          loanApplicationStatus: true,
          createdAt: true,
          applicant: {
            select: { fullName: true, primaryPhoneNumber: true },
          },
          processedBy: {
            select: { fullName: true },
          },
        },
      }) as RecentApplication[];

      registeredUsersCountByAdmin = await prisma.user.count({
        where: { registeredById: userId },
      });

      userRegistrationsPerMonth = await getMonthlyRegistrations();
      applicationsProcessedPerMonth = []; 

      // Removed the duplicate 'const associationCounts' declaration here.

      const businessCount = await prisma.user.count({
        where: { role: 'APPLICANT', isBusiness: true },
      });

      registrationDistribution = associationCounts.map(item => ({
        category: item.associationName ?? 'General/Other',
        count: item._count.id,
      }));

      if (businessCount > 0) {
        const existingIdx = registrationDistribution.findIndex(
          item => item.category === 'Business Entities'
        );
        if (existingIdx === -1) {
          registrationDistribution.push({
            category: 'Business Entities',
            count: businessCount,
          });
        } else {
          registrationDistribution[existingIdx].count += businessCount;
        }
      }
    }

    return NextResponse.json(
      {
        totalApplications,
        totalUsers,
        totalAdmins,
        applicationsByStatus,
        loanApplicationsByStatus,
        recentApplications,
        registeredUsersCountByAdmin,
        userRegistrationsPerMonth,
        applicationsProcessedPerMonth,
        registrationDistribution,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching dashboard summary:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown internal server error occurred.";
    return NextResponse.json(
      { message: 'Internal Server Error', error: errorMessage },
      { status: 500 }
    );
  }
}