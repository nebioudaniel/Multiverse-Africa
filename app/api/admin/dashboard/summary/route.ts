import { NextResponse } from 'next/server';
import { auth } from '@/app/auth'; // Your central authentication utility
import prisma from '@/lib/prisma'; // Your Prisma client

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session || !session.user || (!['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(session.user.role))) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const userId = session.user.id;
        const userRole = session.user.role;

        let totalApplications = 0;
        let totalUsers = 0;
        let totalAdmins = 0;
        let applicationsByStatus: { applicationStatus: string; _count: { id: number } }[] = [];
        let loanApplicationsByStatus: { loanApplicationStatus: string; _count: { id: number } }[] = [];
        let recentApplications: any[] = [];
        let registeredUsersCountByAdmin: number | undefined;
        let userRegistrationsPerMonth: { month: string; count: number }[] = [];
        let applicationsProcessedPerMonth: { month: string; count: number }[] = [];
        let registrationDistribution: { category: string; count: number }[] = [];

        // Common utility for calculating monthly data for users, to avoid duplication
        const getMonthlyRegistrations = async (filterUserId?: string) => {
            const now = new Date();
            const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

            const whereClause: any = {
                createdAt: {
                    gte: twelveMonthsAgo,
                },
                role: 'APPLICANT'
            };

            if (filterUserId) {
                whereClause.registeredById = filterUserId;
            }

            const monthlyRegistrationsRaw = await prisma.user.findMany({
                where: whereClause,
                select: {
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthlyDataMap = new Map<string, number>();

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

        const getMonthlyProcessedApplications = async (adminId: string) => {
            const now = new Date();
            const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

            const monthlyApplicationsRaw = await prisma.application.findMany({
                where: {
                    createdAt: {
                        gte: twelveMonthsAgo,
                    },
                    OR: [
                        { processedById: adminId },
                        { assignedToId: adminId }
                    ]
                },
                select: {
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
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


        if (userRole === "REGISTRAR_ADMIN") {
            const applicationWhereClause = {
                OR: [
                    { processedById: userId },
                    { assignedToId: userId }
                ]
            };

            registeredUsersCountByAdmin = await prisma.user.count({
                where: {
                    registeredById: userId,
                },
            });

            totalUsers = registeredUsersCountByAdmin; 

            totalApplications = await prisma.application.count({
                where: applicationWhereClause
            });

            applicationsByStatus = [];
            loanApplicationsByStatus = [];

            userRegistrationsPerMonth = await getMonthlyRegistrations(userId);

            applicationsProcessedPerMonth = await getMonthlyProcessedApplications(userId);

            recentApplications = await prisma.application.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                where: applicationWhereClause,
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
                    }
                },
            });

        } else if (userRole === "MAIN_ADMIN") {
            totalApplications = await prisma.application.count();
            totalUsers = await prisma.user.count({
                where: { role: 'APPLICANT' }
            });
            totalAdmins = await prisma.admin.count();

            applicationsByStatus = await prisma.application.groupBy({
                by: ['applicationStatus'],
                _count: { id: true },
                orderBy: {
                    _count: { id: 'desc' },
                },
            });

            loanApplicationsByStatus = await prisma.application.groupBy({
                by: ['loanApplicationStatus'],
                _count: { id: true },
                orderBy: {
                    _count: { id: 'desc' },
                },
            });

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
                    }
                },
            });

            registeredUsersCountByAdmin = await prisma.user.count({
                where: {
                    registeredById: userId,
                },
            });

            userRegistrationsPerMonth = await getMonthlyRegistrations();

            applicationsProcessedPerMonth = [];

            const associationCounts = await prisma.user.groupBy({
                by: ['associationName'],
                _count: { id: true },
                where: {
                    role: 'APPLICANT',
                    associationName: { not: null }
                },
                orderBy: {
                    _count: { id: 'desc' },
                },
            });

            // FIX: Changed `registeringAsBusiness` to `isBusiness`
            const businessCount = await prisma.user.count({
                where: {
                    role: 'APPLICANT',
                    isBusiness: true,
                }
            });

            registrationDistribution = associationCounts.map(item => ({
                category: item.associationName as string,
                count: item._count.id
            }));
            
            if (businessCount > 0) {
                registrationDistribution.push({
                    category: 'Business Entities',
                    count: businessCount
                });
            }
        }

        return NextResponse.json({
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
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error', error: (error as Error).message }),
            { status: 500 }
        );
    }
}