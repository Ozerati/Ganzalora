import type { JsonValue } from '../../../types/index';

export const CONTROL_OPTIONS = [1, 2, 3, 4];
export const NORMAL_CELL_MODES = ['none', 'full', 'partial'] as const;
export const LATE_LEVEL_MODES = ['none', 'late0', 'late1', 'late2', 'late3'] as const;
export const ROW_STATUS_CYCLE = ['normal', 'locked', 'gelmedi', 'absent', 'raporlu'] as const;
export const BASE_TOTAL_POINTS = 25;
export const OZENILMIS_BONUS_POINTS = 5;
export const BIG_HOMEWORK_INDEX = 4;
export const OZENILMIS_INDEX = 6;
export const BIG_HOMEWORK_WEIGHT = 7;
export const OTHER_ASSIGNMENT_WEIGHT = 3.6;

type NormalCellMode = typeof NORMAL_CELL_MODES[number];
type LateLevelMode = typeof LATE_LEVEL_MODES[number];
type RowStatus = typeof ROW_STATUS_CYCLE[number];
export type StudentState = Record<string, JsonValue | undefined>;
export type ClassState = Record<string, StudentState>;

export function getAssignmentColumns(controlNo: number) {
	const firstHomeworkNo = (controlNo - 1) * 4 + 1;
	return [
		`${firstHomeworkNo}. Ödev`,
		`${firstHomeworkNo + 1}. Ödev`,
		`${firstHomeworkNo + 2}. Ödev`,
		`${firstHomeworkNo + 3}. Ödev`,
		`${controlNo}. Büyük\nÖdev`,
		`${controlNo}. Kitap\nKontrolü`,
		'Özenilmiş\n(+5)',
	];
}

export function formatClassLabel(classKey: string | number | null | undefined) {
	const text = String(classKey || '').trim().toUpperCase();
	const matched = text.match(/^(\d+)\s*\/?\s*([A-Z])$/);
	if (!matched) return text;
	return `${matched[1]}/${matched[2]}`;
}

function getModePointRatio(mode: string) {
	if (mode === 'full') return 1;
	if (mode === 'partial') return 0.5;
	if (mode === 'late1') return 0.75;
	if (mode === 'late2') return 0.5;
	if (mode === 'late3') return 0.25;
	return 0;
}

function getLatePointMultiplier(lateMode: string) {
	if (lateMode === 'late0') return 1;
	if (lateMode === 'late1') return 0.9;
	if (lateMode === 'late2') return 0.75;
	if (lateMode === 'late3') return 0.5;
	return 1;
}

function getAssignmentWeight(index: number) {
	if (index === BIG_HOMEWORK_INDEX) return BIG_HOMEWORK_WEIGHT;
	if (index === OZENILMIS_INDEX) return 0;
	return OTHER_ASSIGNMENT_WEIGHT;
}

export function calculateScoreFromModes(cellModes: string[], lateModes: string[]) {
	const baseScore = cellModes
		.slice(0, OZENILMIS_INDEX)
		.reduce((total, mode, index) => {
			const completionRatio = getModePointRatio(mode);
			const lateRatio = completionRatio > 0 ? getLatePointMultiplier(lateModes[index]) : 1;
			return total + getAssignmentWeight(index) * completionRatio * lateRatio;
		}, 0);
	const ozenBonus = cellModes[OZENILMIS_INDEX] !== 'none' ? OZENILMIS_BONUS_POINTS : 0;
	const totalScore = baseScore + ozenBonus;

	return {
		baseScore,
		ozenBonus,
		totalScore,
	};
}

export function getAssignmentKey(index: number) {
	return `odev_${index + 1}`;
}

export function getLateAssignmentKey(index: number) {
	return `${getAssignmentKey(index)}_late`;
}

export function getNextCellMode(currentMode: string, assignmentIndex: number): NormalCellMode {
	if (assignmentIndex === OZENILMIS_INDEX) {
		return currentMode === 'none' ? 'full' : 'none';
	}
	const idx = NORMAL_CELL_MODES.indexOf(currentMode as NormalCellMode);
	const nextIdx = idx < 0 ? 1 : (idx + 1) % NORMAL_CELL_MODES.length;
	return NORMAL_CELL_MODES[nextIdx];
}

export function getNextLateMode(currentMode: string): LateLevelMode {
	const idx = LATE_LEVEL_MODES.indexOf(currentMode as LateLevelMode);
	const nextIdx = idx < 0 ? 1 : (idx + 1) % LATE_LEVEL_MODES.length;
	return LATE_LEVEL_MODES[nextIdx];
}

export function getCellMode(studentState: StudentState | null | undefined, assignmentIndex: number): string {
	if (!studentState || typeof studentState !== 'object') return 'none';
	const value = studentState[getAssignmentKey(assignmentIndex)];

	if (assignmentIndex === OZENILMIS_INDEX) {
		return value === undefined || value === null || value === false || value === 'none' ? 'none' : 'full';
	}

	if (value === 'late' || value === 'late1' || value === 'late2' || value === 'late3' || value === 1 || value === 2 || value === 3 || value === '1' || value === '2' || value === '3') {
		return 'full';
	}

	if (value === true || value === 'full') return 'full';
	if (value === 'partial') return 'partial';
	if (value === 'late' || value === 'late1' || value === 1 || value === '1') return 'late1';
	if (value === 'late2' || value === 2 || value === '2') return 'late2';
	if (value === 'late3' || value === 3 || value === '3') return 'late3';
	return 'none';
}

export function getCellLateMode(studentState: StudentState | null | undefined, assignmentIndex: number): LateLevelMode | 'none' {
	if (!studentState || typeof studentState !== 'object') return 'none';
	if (assignmentIndex === OZENILMIS_INDEX) return 'none';

	const lateValue = studentState[getLateAssignmentKey(assignmentIndex)];
	if (lateValue === 'late0' || lateValue === 0 || lateValue === '0') return 'late0';
	if (lateValue === 'late1' || lateValue === 1 || lateValue === '1') return 'late1';
	if (lateValue === 'late2' || lateValue === 2 || lateValue === '2') return 'late2';
	if (lateValue === 'late3' || lateValue === 3 || lateValue === '3') return 'late3';

	return 'none';
}

export function getRowStatus(studentState: StudentState | null | undefined): RowStatus {
	if (!studentState || typeof studentState !== 'object') return 'normal';
	if (studentState._rowStatus === 'locked' || studentState._locked === true) return 'locked';
	if (studentState._rowStatus === 'gelmedi') return 'gelmedi';
	if (studentState._rowStatus === 'absent') return 'absent';
	if (studentState._rowStatus === 'raporlu') return 'raporlu';
	return 'normal';
}

export function getNextRowStatus(currentStatus: string): RowStatus {
	const idx = ROW_STATUS_CYCLE.indexOf(currentStatus as RowStatus);
	const nextIdx = idx < 0 ? 1 : (idx + 1) % ROW_STATUS_CYCLE.length;
	return ROW_STATUS_CYCLE[nextIdx];
}

export function exportBackupFile(payload: JsonValue, classKey: string) {
	const data = {
		version: 1,
		classKey,
		exportedAt: new Date().toISOString(),
		state: payload,
	};

	const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
	const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `portfolio-${classKey}-${stamp}.json`;
	link.click();
	URL.revokeObjectURL(url);
}
