import { useBreadcrumbs, useNotification } from '@common/hooks';
import { CheckIcon, ChevronDownIcon, CloseIcon, EditIcon } from '@common/icons';
import { useTranslation } from '@common/intl';
import { UpsertEntityInput } from '@common/types';
import { Box, ButtonWithIcon, LoadingButton } from '@common/ui';
import { RouteBuilder } from '@common/utils';
import { TreeView } from '@mui/lab';
import { AppRoute } from 'frontend/config/src';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApprovePendingChange, useRequestChange } from '../api';
import { useNextPendingChange } from '../api/hooks/useNextPendingChange';
import { usePendingChange } from '../api/hooks/usePendingChange';
import { useRejectPendingChange } from '../api/hooks/useRejectPendingChange';
import { EditPendingChange } from './EditPendingChange';
import { PendingChangeTreeItem } from './TreeItem';

export const PendingChangeDetails = () => {
  const { id } = useParams();
  const { setSuffix } = useBreadcrumbs();
  const t = useTranslation('system');
  const navigate = useNavigate();
  const { error, success } = useNotification();

  const [rejectPendingChange, invalidateQueriesAfterRejection] =
    useRejectPendingChange();
  const [approvePendingChange, invalidateQueriesAfterApproval] =
    useApprovePendingChange();
  const [requestChange, invalidateQueriesAfterChangeRequest] =
    useRequestChange();

  const [rejectionLoading, setRejectionLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [editChangeLoading, setEditChangeLoading] = useState(false);

  const [isEditMode, setEditMode] = useState(false);

  const [expanded, setExpanded] = useState<string[]>([]);
  const [entity, setEntity] = useState<UpsertEntityInput | null>(null);

  const { data: pendingChange } = usePendingChange(id ?? '');
  const next = useNextPendingChange(id ?? '');

  useEffect(() => {
    if (pendingChange?.name) setSuffix(pendingChange.name);
  }, [pendingChange?.name]);

  useEffect(() => {
    if (pendingChange) setEntity(JSON.parse(pendingChange.body));
  }, [pendingChange]);

  useEffect(() => {
    if (pendingChange) {
      const expandedIds: string[] = [];

      const addToExpandedIds = (ent?: UpsertEntityInput | null) => {
        if (ent) {
          const nodeId = ent.code || ent.description || '?';
          expandedIds.push(nodeId);
          ent.children?.forEach(addToExpandedIds);

          ent?.properties && expandedIds.push(`${nodeId}_properties`);
        }
      };
      addToExpandedIds(entity);

      setExpanded(expandedIds);
    }
  }, [entity]);

  const savePendingChange = async (updatedEntity: UpsertEntityInput) => {
    if (!pendingChange) return;

    setEditChangeLoading(true);

    const { id, category, changeType, name, requestedFor } = pendingChange;

    await requestChange({
      input: {
        requestId: id,
        body: JSON.stringify(updatedEntity),
        // TODO: should these be optional for updates...?
        category,
        changeType,
        requestedFor,
        name,
      },
    });

    invalidateQueriesAfterChangeRequest();
    setEditChangeLoading(false);
    setEditMode(false);
  };

  const approveAndNext = async () => {
    try {
      if (!entity) throw new Error('Entity input is null');
      setApprovalLoading(true);

      await approvePendingChange({ id, input: entity });

      invalidateQueriesAfterApproval();

      setApprovalLoading(false);

      success(
        t('message.status-updated', { status: 'approved', name: entity.name })
      )();

      navigate(
        RouteBuilder.create(AppRoute.Admin)
          .addPart(AppRoute.PendingChanges)
          .addPart(next?.id || '')
          .build()
      );
    } catch (e) {
      setApprovalLoading(false);
      console.error(e);
      error(t('message.entity-error'))();
    }
  };

  const reject = async () => {
    try {
      if (!pendingChange) throw new Error('Pending change is null');

      setRejectionLoading(true);

      await rejectPendingChange({ id });

      invalidateQueriesAfterRejection();

      setRejectionLoading(false);

      success(
        t('message.status-updated', {
          status: 'rejected',
          name: pendingChange.name,
        })
      )();

      navigate(
        RouteBuilder.create(AppRoute.Admin)
          .addPart(AppRoute.PendingChanges)
          .addPart(next?.id || '')
          .build()
      );
    } catch (e) {
      setRejectionLoading(false);
      console.error(e);
      error(t('message.entity-error'))(); // todo diff message
    }
  };

  // TODO: what do display if no data
  if (!entity) return null;

  return isEditMode ? (
    <EditPendingChange
      entity={entity}
      loading={editChangeLoading}
      onSave={savePendingChange}
      onCancel={() => setEditMode(false)}
    />
  ) : (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex' }}>
        <TreeView
          disableSelection
          expanded={expanded}
          defaultExpandIcon={<ChevronDownIcon sx={{ rotate: '-90deg' }} />}
          defaultCollapseIcon={<ChevronDownIcon />}
          sx={{ overflow: 'auto', width: '100%', marginY: '16px' }}
        >
          <PendingChangeTreeItem node={entity} isRoot />
        </TreeView>
        <Box>
          <ButtonWithIcon
            sx={{ marginTop: '16px' }}
            variant="contained"
            onClick={() => setEditMode(true)}
            Icon={<EditIcon />}
            label={t('label.edit')}
          />
        </Box>
      </Box>
      <Box sx={{ float: 'right' }}>
        <LoadingButton
          startIcon={<CloseIcon />}
          onClick={reject}
          isLoading={rejectionLoading}
          variant="outlined"
          sx={{ marginX: '3px' }}
        >
          {t('label.reject')}
        </LoadingButton>
        <LoadingButton
          startIcon={<CheckIcon />}
          onClick={approveAndNext}
          isLoading={approvalLoading}
          sx={{ border: '2px solid #e95c30', marginX: '3px' }}
        >
          {t('label.approve-next')}
        </LoadingButton>
      </Box>
    </Box>
  );
};
