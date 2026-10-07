import { NextRequest, NextResponse } from "next/server";

export interface PatientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  condition: string;
  status: "Active" | "Critical" | "Under Review" | "Completed";
  assignedDoctor: string;
  primaryScan: string;
  lastScanDate: string;
  scansCount: number;
  notes: string;
}

// Global in-memory data store for CRUD operations
let patientsStore: PatientRecord[] = [
  {
    id: "P-001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    condition: "Right Lower Lobe Pneumonia",
    status: "Active",
    assignedDoctor: "Dr. Sarah Mitchell (Pulmonology)",
    primaryScan: "Chest X-Ray PA",
    lastScanDate: "Oct 5, 2026",
    scansCount: 12,
    notes: "Patient responding well to antibiotics. Follow-up CT scan scheduled in 2 weeks.",
  },
  {
    id: "P-002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 234-5678",
    age: 38,
    gender: "Female",
    bloodGroup: "A+",
    condition: "Frontal Lobe Mass (Glioma)",
    status: "Critical",
    assignedDoctor: "Dr. Robert Vance (Neurosurgery)",
    primaryScan: "Brain MRI T2 FLAIR",
    lastScanDate: "Oct 4, 2026",
    scansCount: 8,
    notes: "High priority surgical review required. Vasogenic edema localized.",
  },
  {
    id: "P-003",
    name: "Mike Johnson",
    email: "mike.j@email.com",
    phone: "+1 (555) 345-6789",
    age: 52,
    gender: "Male",
    bloodGroup: "B+",
    condition: "L4-L5 Vertebral Compression",
    status: "Under Review",
    assignedDoctor: "Dr. Elena Rostova (Orthopedics)",
    primaryScan: "Spine CT Sagittal",
    lastScanDate: "Oct 2, 2026",
    scansCount: 15,
    notes: "Physical therapy initiated. Pain scale reduced from 7 to 4.",
  },
  {
    id: "P-004",
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "+1 (555) 456-7890",
    age: 29,
    gender: "Female",
    bloodGroup: "AB+",
    condition: "Post-op Medial Meniscus Repair",
    status: "Completed",
    assignedDoctor: "Dr. Arthur Pendelton (Sports Med)",
    primaryScan: "Knee MRI Coronal",
    lastScanDate: "Sep 28, 2026",
    scansCount: 6,
    notes: "Full mobility restored. Discharged to outpatient routine check.",
  },
  {
    id: "P-005",
    name: "David Brown",
    email: "david.b@email.com",
    phone: "+1 (555) 567-8901",
    age: 61,
    gender: "Male",
    bloodGroup: "O-",
    condition: "Mild Emphysema & Bronchiectasis",
    status: "Active",
    assignedDoctor: "Dr. Sarah Mitchell (Pulmonology)",
    primaryScan: "Chest High-Res CT",
    lastScanDate: "Oct 1, 2026",
    scansCount: 10,
    notes: "Pulmonary function test stable. Inhaler dosage maintained.",
  },
];

// GET: Retrieve list of patients with search and filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.toLowerCase();
    const statusFilter = searchParams.get("status");

    let results = [...patientsStore];

    if (query) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query) ||
          p.condition.toLowerCase().includes(query) ||
          p.assignedDoctor.toLowerCase().includes(query)
      );
    }

    if (statusFilter && statusFilter !== "All") {
      results = results.filter((p) => p.status === statusFilter);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch patient records" },
      { status: 500 }
    );
  }
}

// POST: Create a new patient record (CRUD - Create)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Patient name is required" },
        { status: 400 }
      );
    }

    const nextIdNumber = patientsStore.length + 1;
    const newPatient: PatientRecord = {
      id: `P-${String(nextIdNumber).padStart(3, "0")}`,
      name: body.name,
      email: body.email || `${body.name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
      phone: body.phone || "+1 (555) 000-0000",
      age: Number(body.age) || 30,
      gender: body.gender || "Male",
      bloodGroup: body.bloodGroup || "O+",
      condition: body.condition || "Under Clinical Evaluation",
      status: body.status || "Active",
      assignedDoctor: body.assignedDoctor || "Dr. Sarah Mitchell",
      primaryScan: body.primaryScan || "Chest X-Ray PA",
      lastScanDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      scansCount: 1,
      notes: body.notes || "Initial patient intake completed.",
    };

    patientsStore = [newPatient, ...patientsStore];

    return NextResponse.json({
      success: true,
      data: newPatient,
      message: "Patient registered successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create patient" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing patient record (CRUD - Update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Patient ID is required for update" },
        { status: 400 }
      );
    }

    const index = patientsStore.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Patient not found" },
        { status: 404 }
      );
    }

    patientsStore[index] = {
      ...patientsStore[index],
      ...updates,
    };

    return NextResponse.json({
      success: true,
      data: patientsStore[index],
      message: "Patient updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update patient" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a patient record (CRUD - Delete)
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Patient ID is required" },
        { status: 400 }
      );
    }

    const initialLength = patientsStore.length;
    patientsStore = patientsStore.filter((p) => p.id !== id);

    if (patientsStore.length === initialLength) {
      return NextResponse.json(
        { success: false, error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Patient ${id} deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete patient" },
      { status: 500 }
    );
  }
}
