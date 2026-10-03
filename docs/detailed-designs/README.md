# Detailed designs

## Overview

This folder describes the generic autocomplete primitives and the product-specific autocomplete
built on them. The designs are based on the production components in
[`src/autocomplete/`](../../src/autocomplete/) and
[`src/product-autocomplete/`](../../src/product-autocomplete/), with behavior cross-checked against
the [requirements](../specs/L1.md) and [acceptance criteria](../specs/L2.md).

The generic layer owns the typed provider contract, labeled input, debounce, request lifecycle, and
status messaging. Domain-specific subclasses provide result rendering and messages. The product
adapter supplies product data, expandable result components, and the local demo behavior. Neither
layer has a backend or product data source of its own.

## Description

The implemented design is one vertical slice:

| Feature                       | Capability                                                                                                           | Requirements                         |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Autocomplete](autocomplete/) | Reuse the generic search lifecycle in domain components and compose it with the product result renderer and details. | `L1-001`–`L1-004`; `L2-001`–`L2-007` |

The feature design contains context, container, component, class, and sequence diagrams. Each
diagram has editable PlantUML source and a rendered PNG sibling.

## Requirements

The specification files remain the source of truth for complete acceptance criteria.

| L1 ID    | Requirement                         | Detailed requirements        |
| -------- | ----------------------------------- | ---------------------------- |
| `L1-001` | Reusable native component library   | `L2-001`, `L2-005`           |
| `L1-002` | Reliable product search and details | `L2-002`, `L2-003`, `L2-004` |
| `L1-003` | Accessible, responsive local demos  | `L2-006`                     |
| `L1-004` | Repeatable automated verification   | `L2-007`                     |

## Diagrams

PlantUML sources use built-in UML notation and do not depend on network-hosted includes. C4 views
are represented with PlantUML system and component boundaries so that the diagrams can be rendered
offline. The generic and product APIs build as separate entry points; the root entry remains a
compatibility barrel.
