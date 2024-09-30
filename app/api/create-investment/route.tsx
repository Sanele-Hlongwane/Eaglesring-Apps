import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma'; // Make sure to import Prisma client

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Parse the incoming request JSON

    const {
      amount,
      title,
      investorProfileId,
      entrepreneurProfileId,
      investmentOpportunityId,
    } = data;

    // Validate required fields
    if (!amount || !investorProfileId || !entrepreneurProfileId || !investmentOpportunityId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the InvestorProfile exists
    const investorProfile = await db.investorProfile.findUnique({
      where: { id: investorProfileId },
    });

    if (!investorProfile) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      );
    }

    // Check if the EntrepreneurProfile exists
    const entrepreneurProfile = await db.entrepreneurProfile.findUnique({
      where: { id: entrepreneurProfileId },
    });

    if (!entrepreneurProfile) {
      return NextResponse.json(
        { error: 'Entrepreneur profile not found' },
        { status: 404 }
      );
    }

    // Check if the InvestmentOpportunity exists
    const investmentOpportunity = await db.investmentOpportunity.findUnique({
      where: { id: investmentOpportunityId },
    });

    if (!investmentOpportunity) {
      return NextResponse.json(
        { error: 'Investment opportunity not found' },
        { status: 404 }
      );
    }

    // Create the investment
    const investment = await db.investment.create({
      data: {
        amount: parseFloat(amount),
        title: title,
        investorProfile: { connect: { id: investorProfileId } },
        entrepreneurProfile: { connect: { id: entrepreneurProfileId } },
        investmentOpportunity: { connect: { id: investmentOpportunityId } },
      },
    });

    // Return the created investment
    return NextResponse.json(investment, { status: 201 });

  } catch (error) {
    console.error('Error creating investment:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the investment' },
      { status: 500 }
    );
  }
}
