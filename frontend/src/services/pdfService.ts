import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FormData, Motivo } from "../types";


export const generarDenunciaPDF = (formData: FormData, motivos: Motivo[]) => {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();

	const today = new Date();
	// const formattedDate = formatDate(today);

	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);

	doc.setTextColor(24, 58, 110);
	doc.text("SISTEMA DE DENUNCIAS DE CORRUPCIÓN", pageWidth / 2, 20, {
		align: "center",
	});
	doc.text(
		"MUNICIPALIDAD DISTRITAL DE JOSÉ LEONARDO ORTIZ",
		pageWidth / 2,
		30,
		{ align: "center" }
	);

	doc.setFont("helvetica", "normal");
	doc.setFontSize(12);
	doc.setTextColor(100);
	// doc.text(`Fecha de emisión: ${formattedDate}`, pageWidth - 20, 40, { align: 'right' });

	doc.setDrawColor(24, 50, 110);
	doc.setLineWidth(0.5);
	doc.line(14, 45, pageWidth - 14, 45);

	doc.setFont("helvetica", "bold");
	doc.setFontSize(14);
	doc.setTextColor(24, 58, 110);
	doc.text("CÓDIGO DE SEGUIMIENTO", 14, 55);

	doc.setFont("helvetica", "bold");
	doc.setTextColor(231, 76, 60);
	doc.text(formData.tracking_code || "No disponible", 80, 55);

	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.setTextColor(24, 58, 110);
	doc.text("INFORMACIÓN DE LA DENUNCIA", 14, 70);

	const denunciaDetails = [
		["Fecha del incidente", formData.fecha_incidente || "No especfícada"],
		[
			"Tipo de denuncia",
			formData.es_anonimo ? "Anónima" : "Con datos personales",
		],
		[
			"Motivo de la denuncia",
			formData.motivo_otro
				? "Otro"
				: formData.motivo_id
				? motivos.find((m) => m.id === formData.motivo_id)?.nombre || "No disponible"
				: "No disponible",
		],
	];

	autoTable(doc, {
		startY: 75,
		head: [["Campo", "Detalle"]],
		body: denunciaDetails,
		theme: "striped",
		headStyles: {
			fillColor: [24, 58, 110],
			textColor: 255,
		},
	});

	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.setTextColor(24, 58, 110);
	doc.text("DESCRIPCIÓN DE LOS HECHOS", 14, doc.lastAutoTable.finalY + 15);

	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.setTextColor(60, 60, 60);

	const splitDescription = doc.splitTextToSize(
		formData.descripcion,
		pageWidth - 30
	);
	doc.text(splitDescription, 14, doc.lastAutoTable.finalY + 25);

	let yPosition =
		doc.lastAutoTable.finalY + 25 + splitDescription.length * 5 + 10;

	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.setTextColor(24, 58, 110);
	doc.text("DATOS DEL DENUNCIADO", 14, yPosition);

	const denunciadoDetails = [
		["Tipo de documento", formData.denunciado.tipo_documento],
		["Número de documento", formData.denunciado.numero_documento],
		[
			"Nombre / Razón Social",
			formData.denunciado.nombre ||
				formData.denunciado.razon_social ||
				"No disponible",
		],
		["Cargo", formData.denunciado.cargo || "No disponible"],
	];

	if (formData.denunciado.tipo_documento === "ruc") {
		denunciaDetails.push([
			"Representante legal",
			formData.denunciado.representante_legal || "No disponible",
		]);
	}

	autoTable(doc, {
		startY: yPosition + 5,
		head: [["Campo", "Detalle"]],
		body: denunciadoDetails,
		theme: "striped",
		headStyles: {
			fillColor: [24, 58, 110],
			textColor: 255,
		},
	});

	if (!formData.es_anonimo && formData.denunciante) {
		yPosition = doc.lastAutoTable.finalY + 15;

		doc.setFont("helvetica", "bold");
		doc.setFontSize(12);
		doc.setTextColor(24, 58, 110);
		doc.text("DATOS DEL DENUNCIANTE", 14, yPosition);

		const denuncianteDetails = [
			["Tipo de documento", formData.denunciante.tipo_documento],
			["Número de documento", formData.denunciante.numero_documento],
			["Nombre completo", formData.denunciante.nombres],
			["Sexo", formData.denunciante.sexo || "No especificado"],
			["Email", formData.denunciante.email || "No especificado"],
			["Teléfono", formData.denunciante.telefono || "No especificado"],
		];

		autoTable(doc, {
			startY: yPosition + 5,
			head: [["Campo", "Detalle"]],
			body: denuncianteDetails,
			theme: "striped",
			headStyles: {
				fillColor: [24, 58, 110],
				textColor: 255,
			},
		});
	}

	const finalY = doc.lastAutoTable
		? doc.lastAutoTable.finalY + 20
		: yPosition + 40;

	doc.setFont("helvetica", "italic");
	doc.setFontSize(10);
	doc.setTextColor(100);
	doc.text(
		"Este documento es una constancia de la denuncia presentada y no constituye",
		pageWidth / 2,
		finalY,
		{ align: "center" }
	);
	doc.text(
		"una admisión o validación de los hechos denunciados.",
		pageWidth / 2,
		finalY + 5,
		{ align: "center" }
	);

    doc.save(`Denuncia-${formData.tracking_code}.pdf`);
};
