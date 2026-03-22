# 🗺️ Backend MVP Roadmap - GreenPe (Carbon UPI)

## 🎯 Goal: Functional MVP in 2 Weeks

Transform the current **UI-only prototype** into a **working application** where users can:
1. Register and authenticate
2. Create entities and assets
3. Upload data sources
4. Generate Green Impact Certificates (GICs)
5. View and download certificates

---

## 📊 Current Backend Status Analysis

### ✅ What Exists (Partial Implementation):

1. **API Routes Created:**
   - `/api/certificates` - Mock data (GET only)
   - `/api/pipeline` - Pipeline execution (POST works with mock data)
   - `/api/agents/*` - Agent endpoints (incomplete)
   - `/api/carbon/calculate` - Has broken imports

2. **Core Libraries:**
   - `@/lib/carbon-upi/engine` - Pipeline logic exists
   - `@/lib/solar-api` - Solar data fetching
   - `@/lib/generate-certificate` - PDF generation

3. **Frontend Components:**
   - Dashboard UI complete
   - Forms and wizards ready
   - Certificate preview working

### ❌ What's Missing (Critical Blockers):

1. **No Database:**
   - No persistence layer
   - No schema defined
   - No migrations

2. **No Authentication:**
   - No user sessions
   - No role-based access
   - No API security

3. **Incomplete API Logic:**
   - Certificate generation broken (langchain import error)
   - No real data validation
   - No error handling

4. **No File Storage:**
   - Certificate PDFs not persisted
   - No document upload
   - No asset binding

---

## 🏗️ MVP Implementation Plan

### **PHASE 1: Foundation (Days 1-3)**

#### Day 1: Database Setup

**Task 1.1: Install Prisma ORM**
```bash
npm install prisma @prisma/client
npx prisma init
```

**Task 1.2: Define Schema**
File: `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Core Models
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  role          Role      @default(FARMER)
  entities      Entity[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  FARMER
  EXPORTER
  GOVERNMENT
  AUDITOR
}

model Entity {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  type            String    // FARMER, COMPANY, etc
  name            String
  registrationId  String?
  gstin           String?
  location        Json?
  assets          Asset[]
  certificates    Certificate[]
  createdAt       DateTime  @default(now())
}

model Asset {
  id            String    @id @default(cuid())
  entityId      String
  entity        Entity    @relation(fields: [entityId], references: [id])
  type          String    // LAND, SOLAR_PANEL, WIND_TURBINE
  description   String
  metadata      Json?     // Coordinates, capacity, etc
  dataSources   DataSource[]
  createdAt     DateTime  @default(now())
}

model DataSource {
  id          String    @id @default(cuid())
  assetId     String
  asset       Asset     @relation(fields: [assetId], references: [id])
  type        String    // IOT_SENSOR, SATELLITE, MANUAL
  sourceId    String
  dataPoints  DataPoint[]
  createdAt   DateTime  @default(now())
}

model DataPoint {
  id            String      @id @default(cuid())
  dataSourceId  String
  dataSource    DataSource  @relation(fields: [dataSourceId], references: [id])
  timestamp     DateTime
  value         Float
  unit          String
  trustScore    String      // HIGH, MEDIUM, LOW
  raw           Json?
  createdAt     DateTime    @default(now())
}

model Certificate {
  id              String    @id @default(cuid())
  certificateId   String    @unique  // GP-XXXX-XX
  entityId        String
  entity          Entity    @relation(fields: [entityId], references: [id])
  projectName     String
  projectType     String
  location        String
  carbonReduced   Float
  vintage         String
  issuedDate      DateTime
  verifier        String
  status          String    @default("ISSUED")
  pdfUrl          String?
  metadata        Json?     // Full certificate data
  createdAt       DateTime  @default(now())
}
```

**Task 1.3: Create Database**
```bash
# Create PostgreSQL database (local or cloud)
# Option 1: Local Docker
docker run --name greenpe-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# Option 2: Supabase (free tier)
# Go to supabase.com, create project, get connection string

# Add to .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/greenpe"

# Run migrations
npx prisma migrate dev --name init
npx prisma generate
```

**Deliverable:** ✅ Database schema defined and migrated

---

#### Day 2: Authentication Setup

**Task 2.1: Install NextAuth.js**
```bash
npm install next-auth @next-auth/prisma-adapter
```

**Task 2.2: Create Auth Configuration**
File: `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name || credentials.email,
            },
          });
        }

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/onboarding",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Task 2.3: Create Prisma Client**
File: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Task 2.4: Protect API Routes**
File: `src/lib/auth.ts`

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
```

**Deliverable:** ✅ Users can sign in and sessions are managed

---

#### Day 3: Core API Routes

**Task 3.1: Entity Management API**
File: `src/app/api/entities/route.ts`

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireAuth();
    const entities = await prisma.entity.findMany({
      where: { userId: session.user.id },
      include: { assets: true },
    });
    return NextResponse.json({ entities });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const entity = await prisma.entity.create({
      data: {
        userId: session.user.id,
        type: body.type,
        name: body.name,
        registrationId: body.registrationId,
        gstin: body.gstin,
        location: body.location,
      },
    });

    return NextResponse.json({ entity });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create entity" }, { status: 500 });
  }
}
```

**Task 3.2: Asset Management API**
File: `src/app/api/assets/route.ts`

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    // Verify entity ownership
    const entity = await prisma.entity.findFirst({
      where: {
        id: body.entityId,
        userId: session.user.id,
      },
    });

    if (!entity) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    const asset = await prisma.asset.create({
      data: {
        entityId: body.entityId,
        type: body.type,
        description: body.description,
        metadata: body.metadata,
      },
    });

    return NextResponse.json({ asset });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
  }
}
```

**Deliverable:** ✅ Users can create entities and assets

---

### **PHASE 2: Core Features (Days 4-7)**

#### Day 4: Data Ingestion

**Task 4.1: Fix Data Upload API**
File: `src/app/api/data/upload/route.ts`

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    // Verify asset ownership
    const asset = await prisma.asset.findFirst({
      where: {
        id: body.assetId,
        entity: { userId: session.user.id },
      },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Create data source
    const dataSource = await prisma.dataSource.create({
      data: {
        assetId: body.assetId,
        type: body.sourceType,
        sourceId: body.sourceId,
      },
    });

    // Bulk create data points
    const dataPoints = await prisma.dataPoint.createMany({
      data: body.dataPoints.map((dp: any) => ({
        dataSourceId: dataSource.id,
        timestamp: new Date(dp.timestamp),
        value: dp.value,
        unit: dp.unit,
        trustScore: dp.trustScore || "MEDIUM",
        raw: dp.raw,
      })),
    });

    return NextResponse.json({ dataSource, count: dataPoints.count });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

**Deliverable:** ✅ Users can upload data for assets

---

#### Day 5-6: Certificate Generation

**Task 5.1: Fix Certificate API**
File: `src/app/api/certificates/generate/route.ts`

Remove broken langchain imports and use simple logic:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { runPipeline, METHODOLOGIES } from "@/lib/carbon-upi/engine";
import { generateGreenImpactCertificate } from "@/lib/generate-certificate";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    // Get entity, asset, and data points from database
    const entity = await prisma.entity.findFirst({
      where: {
        id: body.entityId,
        userId: session.user.id,
      },
    });

    if (!entity) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    const asset = await prisma.asset.findFirst({
      where: {
        id: body.assetId,
        entityId: entity.id,
      },
      include: {
        dataSources: {
          include: {
            dataPoints: {
              orderBy: { timestamp: "desc" },
              take: 100,
            },
          },
        },
      },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Flatten data points
    const dataPoints = asset.dataSources.flatMap((ds) =>
      ds.dataPoints.map((dp) => ({
        id: dp.id,
        sourceType: ds.type as any,
        sourceId: ds.sourceId,
        timestamp: dp.timestamp,
        value: dp.value,
        unit: dp.unit,
        trustScore: dp.trustScore as any,
        raw: dp.raw as any,
      }))
    );

    // Run MRV pipeline
    const pipelineResult = runPipeline({
      entity: {
        id: entity.id,
        type: entity.type,
        name: entity.name,
        registrationId: entity.registrationId || "",
        location: entity.location as any,
        createdAt: entity.createdAt,
      },
      asset: {
        id: asset.id,
        type: asset.type,
        ownerId: entity.id,
        description: asset.description,
        metadata: asset.metadata as any,
        boundAt: asset.createdAt,
      },
      rawDataPoints: dataPoints,
      methodology: METHODOLOGIES[0],
      timeWindow: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    });

    // Generate certificate ID
    const certificateId = `GP-${Date.now().toString(36).toUpperCase().slice(-4)}-VX`;

    // Generate PDF
    const certificateData = {
      certificateId,
      projectName: asset.description,
      projectType: asset.type,
      location: (entity.location as any)?.region || "Unknown",
      gstin: entity.gstin || "",
      industrialId: entity.registrationId || "",
      carbonReduced: pipelineResult.gic.impactQuantified.carbonOffsetTons.toString(),
      vintage: new Date().getFullYear().toString(),
      issuedDate: new Date().toISOString().split("T")[0],
      verifier: "CarbonCore AI Auditor",
      recipientName: entity.name,
      recipientAddress: (entity.location as any)?.region || "",
    };

    const pdfBuffer = await generateGreenImpactCertificate(certificateData);

    // TODO: Upload PDF to storage (S3, Cloudflare R2, etc.)
    // For now, store base64 in database (not production-ready)
    const pdfBase64 = pdfBuffer.toString("base64");

    // Save certificate to database
    const certificate = await prisma.certificate.create({
      data: {
        certificateId,
        entityId: entity.id,
        projectName: certificateData.projectName,
        projectType: certificateData.projectType,
        location: certificateData.location,
        carbonReduced: parseFloat(certificateData.carbonReduced),
        vintage: certificateData.vintage,
        issuedDate: new Date(certificateData.issuedDate),
        verifier: certificateData.verifier,
        status: "ISSUED",
        pdfUrl: `data:application/pdf;base64,${pdfBase64}`, // Temporary
        metadata: {
          pipelineResult,
          certificateData,
        },
      },
    });

    return NextResponse.json({
      success: true,
      certificate,
      pdfUrl: certificate.pdfUrl,
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
```

**Task 5.2: Update Certificates List API**
File: `src/app/api/certificates/route.ts`

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireAuth();

    const certificates = await prisma.certificate.findMany({
      where: {
        entity: { userId: session.user.id },
      },
      include: {
        entity: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      certificates: certificates.map((cert) => ({
        id: cert.certificateId,
        date: cert.issuedDate.toISOString().split("T")[0],
        impact: cert.carbonReduced,
        status: cert.status,
        confidence: 98, // TODO: Calculate from pipeline
        type: cert.projectType,
        entity: cert.entity.name,
        pdfUrl: cert.pdfUrl,
      })),
      total: certificates.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
```

**Deliverable:** ✅ Users can generate and view certificates

---

#### Day 7: Testing & Bug Fixes

**Task 7.1: End-to-End Test Flow**
```
1. Sign in with email
2. Create entity (farmer)
3. Create asset (solar panel)
4. Upload data points
5. Generate certificate
6. Download PDF
7. View in dashboard
```

**Task 7.2: Fix Critical Bugs**
- Broken imports (langchain)
- Missing error handling
- Type safety issues
- UI/API connection bugs

**Deliverable:** ✅ Complete user flow works end-to-end

---

### **PHASE 3: Polish & Deploy (Days 8-10)**

#### Day 8: File Storage

**Task 8.1: Setup Cloudflare R2 (or S3)**
```bash
npm install @aws-sdk/client-s3
```

**Task 8.2: Upload PDFs to Storage**
File: `src/lib/storage.ts`

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadPDF(
  buffer: Buffer,
  certificateId: string
): Promise<string> {
  const key = `certificates/${certificateId}.pdf`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
```

**Deliverable:** ✅ PDFs stored in cloud, not database

---

#### Day 9: Deployment to Coolify

**Task 9.1: Prepare for Production**
```bash
# Add production environment variables
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://greenpe.com
R2_ENDPOINT=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_URL=...
```

**Task 9.2: Deploy to Coolify**
- Push code to GitHub
- Connect repository in Coolify
- Add environment variables
- Deploy and test

**Deliverable:** ✅ Backend running on Coolify

---

#### Day 10: Final Testing & Documentation

**Task 10.1: Production Testing**
- Test all user flows
- Load testing
- Security audit
- Error monitoring

**Task 10.2: Documentation**
- API documentation
- User guide
- Admin guide

**Deliverable:** ✅ Production-ready MVP

---

## 📋 Complete Checklist

### Database & Auth ✅
- [ ] PostgreSQL database created
- [ ] Prisma schema defined
- [ ] Migrations run
- [ ] NextAuth.js configured
- [ ] Session management working
- [ ] Protected routes implemented

### Core APIs ✅
- [ ] `/api/entities` - CRUD
- [ ] `/api/assets` - CRUD
- [ ] `/api/data/upload` - Data ingestion
- [ ] `/api/pipeline` - Pipeline execution
- [ ] `/api/certificates/generate` - Certificate generation
- [ ] `/api/certificates` - List certificates

### Features ✅
- [ ] User registration
- [ ] Entity management
- [ ] Asset creation
- [ ] Data upload
- [ ] Certificate generation
- [ ] PDF download
- [ ] Dashboard displays real data

### Infrastructure ✅
- [ ] File storage (R2/S3)
- [ ] Error handling
- [ ] Logging
- [ ] Rate limiting
- [ ] CORS configuration

### Deployment ✅
- [ ] Frontend on Vercel
- [ ] Backend on Coolify
- [ ] Database hosted
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificates

### Testing ✅
- [ ] User flow tested
- [ ] API endpoints tested
- [ ] Error cases handled
- [ ] Performance acceptable

---

## 🚨 Critical Blockers to Fix NOW

### 1. Remove Langchain Dependency
**File:** `src/app/api/carbon/calculate/route.ts`

**Issue:** Import error
```typescript
import { StructuredOutputParser } from "langchain/output_parsers";
```

**Fix:** Remove this file or rewrite without langchain

### 2. Fix Certificate Generation
**File:** `src/app/api/certificates/generate/route.ts`

**Current:** Might have similar issues

**Fix:** Ensure it uses only available libraries

### 3. Add Environment Variables
**File:** `.env.local`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/greenpe"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 📈 Success Metrics

After 2 weeks, you should have:

1. **Working Authentication:** Users can sign in
2. **Entity Management:** Create farms, companies, etc.
3. **Asset Binding:** Link solar panels, land parcels
4. **Data Upload:** CSV/JSON data ingestion
5. **Certificate Generation:** Real PDF certificates
6. **Dashboard:** Shows actual user data
7. **Deployment:** Live on Vercel + Coolify

---

## 🎯 Next Steps (Post-MVP)

1. **AI Agents:** Implement multi-agent workflow
2. **Advanced MRV:** More methodologies
3. **Registry Integration:** Connect to carbon registries
4. **Mobile App:** React Native app
5. **Analytics:** Dashboard analytics
6. **Notifications:** Email/SMS alerts
7. **Payments:** Subscription billing

---

**Timeline:** 10 working days
**Outcome:** Functional MVP that users can actually use
**Deployment:** Frontend (Vercel) + Backend (Coolify)

Let's ship it! 🚀
