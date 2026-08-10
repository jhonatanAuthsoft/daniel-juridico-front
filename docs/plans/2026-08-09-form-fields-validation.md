# Form Fields Validation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Endurecer validação de RG e datas, limpar placeholders enganosos (órgão/UF/OTP), sem alterar CPF, OAB (sem máscara) nem máscara de salário.

**Architecture:** Estender helpers em `br-input.ts` e factories em `FieldValidators`; trocar uso nos steps de cadastro e no `InputOTP`. TDD nos unitários de `br-input` / validators.

**Tech Stack:** React Native / Expo, react-hook-form, Jest (`app/src/utils/br-input.test.ts`).

**Design:** `docs/plans/2026-08-09-form-fields-validation-design.md` (cópia em `app/docs/plans/`).

---

### Task 1: Testes de RG (failing)

**Files:**
- Modify: `app/src/utils/br-input.test.ts`

**Step 1: Write the failing tests**

```ts
import { isValidRg, maskRg } from '@/utils/br-input';

it('masks RG with single check digit', () => {
  expect(maskRg('123456789')).toBe('12.345.678-9');
  expect(maskRg('12345678')).toBe('12.345.678');
});

it('validates RG requires exactly 9 digits', () => {
  expect(isValidRg('12.345.678-9')).toBe(true);
  expect(isValidRg('12.345.678')).toBe(false);
  expect(isValidRg('1234')).toBe(false);
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npx jest --no-watchman src/utils/br-input.test.ts`

Expected: FAIL (`isValidRg` missing and/or expectations).

**Step 3: Commit**

```bash
git add src/utils/br-input.test.ts
git commit -m "$(cat <<'EOF'
test: add RG mask and length validation cases

EOF
)"
```

---

### Task 2: Implementar RG

**Files:**
- Modify: `app/src/utils/br-input.ts`
- Modify: `app/src/constants/field-validators.ts`
- Modify: `app/src/components/signup-client/step-personal-documents/step-personal-documents.component.tsx`
- Modify: `app/src/components/signup-lawyer/step-documentation/step-documentation.component.tsx`

**Step 1: Implement `isValidRg` and tighten `maskRg`**

```ts
export function maskRg(value: string): string {
  const digits = onlyDigits(value).slice(0, 9);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}-${digits.slice(8)}`;
}

export function isValidRg(value: string): boolean {
  return onlyDigits(value).length === 9;
}
```

**Step 2: Add `FieldValidators.rg`**

```ts
rg: (value: string) => {
  if (!value.trim()) return 'Campo obrigatório';
  return isValidRg(value) ? true : 'RG inválido';
},
```

**Step 3: Wire steps**

Replace `validate={FieldValidators.digitsMin(5, 'RG inválido')}` with `validate={FieldValidators.rg}` in client personal-documents and lawyer documentation.

**Step 4: Run tests**

Run: `cd app && npx jest --no-watchman src/utils/br-input.test.ts`

Expected: PASS for RG cases.

**Step 5: Commit**

```bash
git add src/utils/br-input.ts src/constants/field-validators.ts \
  src/components/signup-client/step-personal-documents/step-personal-documents.component.tsx \
  src/components/signup-lawyer/step-documentation/step-documentation.component.tsx \
  src/utils/br-input.test.ts
git commit -m "$(cat <<'EOF'
fix: require full RG with single check digit

EOF
)"
```

---

### Task 3: Testes de data com piso e sem futuro (failing)

**Files:**
- Modify: `app/src/utils/br-input.test.ts`

**Step 1: Write failing tests**

```ts
import { isValidDateBr } from '@/utils/br-input';

it('rejects invalid calendar dates', () => {
  expect(isValidDateBr('31/02/2000')).toBe(false);
  expect(isValidDateBr('15/13/2000')).toBe(false);
});

it('enforces minYear and no future for birth', () => {
  expect(isValidDateBr('01/01/1919', { minYear: 1920, allowFuture: false })).toBe(false);
  expect(isValidDateBr('01/01/1920', { minYear: 1920, allowFuture: false })).toBe(true);
  // use a fixed far-future date:
  expect(isValidDateBr('01/01/2999', { minYear: 1920, allowFuture: false })).toBe(false);
});

it('enforces OAB issue minYear 1950', () => {
  expect(isValidDateBr('01/01/1949', { minYear: 1950, allowFuture: false })).toBe(false);
  expect(isValidDateBr('01/01/1950', { minYear: 1950, allowFuture: false })).toBe(true);
});
```

**Step 2: Run to verify fail**

Run: `cd app && npx jest --no-watchman src/utils/br-input.test.ts`

**Step 3: Commit test**

```bash
git add src/utils/br-input.test.ts
git commit -m "$(cat <<'EOF'
test: add date floor and future rejection cases

EOF
)"
```

---

### Task 4: Implementar datas parametrizadas + validators

**Files:**
- Modify: `app/src/utils/br-input.ts`
- Modify: `app/src/constants/field-validators.ts`
- Modify: `app/src/components/signup-client/step-personal-documents/step-personal-documents.component.tsx`
- Modify: `app/src/components/signup-lawyer/step-oab-registration/step-oab-registration.component.tsx`

**Step 1: Extend `isValidDateBr`**

```ts
export type DateBrOptions = {
  minYear?: number;
  allowFuture?: boolean;
};

export function isValidDateBr(value: string, options: DateBrOptions = {}): boolean {
  // existing calendar parse...
  const minYear = options.minYear ?? 1900;
  if (year < minYear) return false;
  if (options.allowFuture === false) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) return false;
  }
  return true;
}
```

Keep default call `isValidDateBr(value)` backward compatible (minYear 1900, future allowed) **or** tighten default — prefer options only via new FieldValidators.

**Step 2: FieldValidators**

```ts
dateBrBirth: (value) => {
  if (!value.trim()) return 'Campo obrigatório';
  return isValidDateBr(value, { minYear: 1920, allowFuture: false })
    ? true
    : 'Data inválida';
},
dateBrOabIssue: (value) => {
  if (!value.trim()) return 'Campo obrigatório';
  return isValidDateBr(value, { minYear: 1950, allowFuture: false })
    ? true
    : 'Data inválida';
},
```

**Step 3: Wire UI**

- Client birthDate → `FieldValidators.dateBrBirth`
- Lawyer `oabIssueDate` → `FieldValidators.dateBrOabIssue`
- Supplemental OAB `issueDate` → same `dateBrOabIssue` when validating (add `validate` if missing)

**Step 4: Run tests + commit**

```bash
cd app && npx jest --no-watchman src/utils/br-input.test.ts
git add ...
git commit -m "$(cat <<'EOF'
fix: enforce birth and OAB date floors without future dates

EOF
)"
```

---

### Task 5: Placeholders órgão/UF + OTP

**Files:**
- Modify: `app/src/components/signup-client/step-personal-documents/step-personal-documents.component.tsx`
- Modify: `app/src/components/signup-lawyer/step-documentation/step-documentation.component.tsx`
- Modify: `app/src/atomic/form/input-otp.component.tsx`
- Modify: `app/test/components/step-personal-documents.test.tsx` (se assertar `SSP`/`BA`)

**Step 1: Placeholders**

- `issuingAuthority` placeholder: `Selecione`
- `uf` placeholder: `UF`

**Step 2: OTP**

Remove `placeholder={String(index + 1)}` (and unused placeholder color if only used for that).

**Step 3: Fix tests / run suite slice**

```bash
cd app && npx jest --no-watchman test/components/step-personal-documents src/utils/br-input.test.ts
```

**Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
fix: clarify select placeholders and clear OTP cell placeholders

EOF
)"
```

---

### Task 6: Verificação final

**Step 1: Full related tests**

```bash
cd app && npx jest --no-watchman src/utils/br-input.test.ts test/components/step-personal-documents
```

**Step 2: Grep leftovers**

```bash
rg "digitsMin\\(5, 'RG|placeholder=\"SSP\"|placeholder=\"BA\"|placeholder=\\{String\\(index" app/src
```

Expected: no matches.

**Step 3: Final commit if anything left** (docs already committed separately)

---

## Out of scope (não fazer)

- Máscara de formato OAB
- Mudança visual salário (`R$` / milhares)
- Idade mínima legal (18+) além do piso 1920
- Refator Zod / schema global
